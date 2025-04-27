import openSearchClient from "@/app/api/_lib/opensearch";

export async function GET(){

    const updateResp =  await openSearchClient.update({
        index: 'stores',
        id: "AgtsSZYBDM2YJ48JhdOy",
        body: {
            doc: {
                access_token: "ll06mbwwgtiqm2p3jw4377e3rirmrw0"
            }
        }
    });

    return new Response(JSON.stringify(updateResp))
    
}