import openSearchClient from "@/app/api/_lib/opensearch";

export async function GET(){

    const updateResp =  await openSearchClient.update({
        index: 'stores',
        id: "AgtsSZYBDM2YJ48JhdOy",
        body: {
            doc: {
                access_token: "3msb1bp2i5x4n1m74bx9y6hy39afyu8"
            }
        }
    });

    return new Response(JSON.stringify(updateResp))

}