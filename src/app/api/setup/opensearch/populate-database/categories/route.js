import openSearchClient from "@/app/api/_lib/opensearch";
import { fakeCategories } from "./fake";

export async function POST(){

    try{

        const bulkBody = [];

        for (let i = 0; i < fakeCategories.length; i++) {

            const row =fakeCategories[i];  // Generate a row based on your specs

            // Add the action and row data to the bulk body
            bulkBody.push({ index: {} });  // Action for bulk insert
            bulkBody.push(row);  // Row data to insert

        }
        
        const response = await openSearchClient.bulk({ index: 'catgory', body: bulkBody });


        
        return new Response(JSON.stringify(response))

    }catch(error){
        
        throw new Response("error: "+error.message)
    
    }

}


// Handle the GET request to fetch documents from OpenSearch
export async function GET() {
    try {
      // Query to get all documents from the 'specs' index
      const response = await openSearchClient.search({
        index: 'catgory',
        body: {
          query: {
                match:{
                     store_hash: 'bohaxauo'
                }
            }
        }
      });
  
      // Check if documents are found and format the response
      const docs = response.body.hits.hits;
      if (docs.length === 0) {
        return new Response('No documents found');
      }
  
      // Return the retrieved documents
      return new Response(JSON.stringify(docs), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  
    } catch (error) {
      console.error('Error fetching documents:', error);
      return new Response('Error fetching documents', { status: 500 });
    }
}