import openSearchClient from "../../_lib/opensearch";
// Handle the GET request to fetch documents from OpenSearch
export async function GET(request) {
    const url = new URL(request.url);

    const storeHash = url.searchParams.get("store_hash") 

    try {
      // Query to get all documents from the 'specs' index
      const response = await openSearchClient.search({
        index: 'catgory',
        body: {
          query: {
                match:{
                     store_hash: storeHash
                }
            }
        }  
      });
      
      // Check if documents are found and format the response
      const all_categories = response.body.hits.hits.map(({_source}) => _source);
    
      // Return the retrieved documents
      return new Response(JSON.stringify(all_categories), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
  
    } catch (error) {
      console.error('Error fetching documents:', error.message);
      return new Response(JSON.stringify({status: false, message: 'Error fetching documents - ' + error.message  }), { status: 200 });
    }
}