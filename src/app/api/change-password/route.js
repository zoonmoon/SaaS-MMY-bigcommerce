import { getLoggedInUsername } from "../_lib/session";
import openSearchClient from "../_lib/opensearch";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { token_exists, username } = await getLoggedInUsername();

    console.log(token_exists, username)

    if (!token_exists) {
      throw new Error("Unauthorized. Please log in.");
    }

    const data = await request.formData();
    const currentPassword = data.get("currentPassword");
    const newPassword = data.get("newPassword");

    if (!currentPassword || !newPassword ) {
      throw new Error("All fields are required.");
    }


    // 1. Fetch the user from OpenSearch
    const searchResult = await openSearchClient.search({
      index: "users",
      body: {
        query: {
          term: {
            username: username,
          },
        },
      },
    });

    if (
      !searchResult.body.hits.total.value ||
      searchResult.body.hits.total.value === 0
    ) {
      throw new Error("User not found.");
    }

    const userDoc = searchResult.body.hits.hits[0];
    const user = userDoc._source;

    // 2. Compare current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      throw new Error("Current password is incorrect.");
    }

    // 3. Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update the user document in OpenSearch
    await openSearchClient.update({
      index: "users",
      id: userDoc._id,
      body: {
        doc: {
          password: hashedNewPassword,
        },
      },
      refresh: true,
    });

    return new Response(
      JSON.stringify({ success: true, message: "Password changed successfully." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400 }
    );
  }
}
