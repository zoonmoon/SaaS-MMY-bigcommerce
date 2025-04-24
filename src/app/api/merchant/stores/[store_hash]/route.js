import { getLoggedInUsername } from "@/app/api/_lib/session";
import openSearchClient from "@/app/api/_lib/opensearch";

export async function GET(request, {params}){

    const index = 'stores';

    const store_hash = params.store_hash

    const {token_exists, username} = await getLoggedInUsername()
    
    try {
      
      // Check for duplicate store_hash for this username
      const existing = await openSearchClient.search({
        index,
        body: {
          query: {
            bool: {
              must: [
                { term: { username } },
                { term: { store_hash } }
              ]
            }
          }
        }
      });
      
      if (existing.body.hits.total.value > 0) {

        let storeData = existing.body.hits.hits.map(s => ({id: s._id, ...s._source}))[0]

        storeData = {...storeData, access_token: ''}

        return new Response(
          JSON.stringify({ success: true, storeData}),
          { status: 200 }
        );
      }else{
        return new Response(
            JSON.stringify({ success: false, message: "Store not found." }),
            { status: 404 }
          );
      }

    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500 }
      );
    }
}