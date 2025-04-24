import openSearchClient from "@/app/api/_lib/opensearch";
import { generateSpecsData } from "./fakedata";


export async function POST(){
    try {

        const testData = generateSpecsData();

        const response = await openSearchClient.index({
          index: 'specs', // Index name
          body: testData
        });
        
        console.log(response)

        return new Response('Document inserted successfully');

    } catch (error) {
    
        return new Response('Error inserting document:');
    
    }
}


// Handle the GET request to fetch documents from OpenSearch
export async function GET() {
    try {
      // Query to get all documents from the 'specs' index
      const response = await openSearchClient.search({
        index: 'specs',
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
        return new Response('No documents found', { status: 404 });
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