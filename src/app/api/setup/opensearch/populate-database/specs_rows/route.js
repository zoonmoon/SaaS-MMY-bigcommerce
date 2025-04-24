import openSearchClient from "@/app/api/_lib/opensearch";

import { generateRow } from "./fake";

let bulkBody = [];
const batchSize = 100; // Define your batch size, e.g., 1000 rows per batch
const totalRows = 100; // Total rows to insert


export async function POST(){
    
    return new Response('Data Inserted')

    async function insertBulkData() {
        for (let i = 0; i < totalRows; i++) {
          const row = generateRow();  // Generate a row based on your specs
      
          // Add the action and row data to the bulk body
          bulkBody.push({ index: {} });  // Action for bulk insert
          bulkBody.push(row);  // Row data to insert
      
          // If the bulkBody array reaches the defined batch size, send the bulk insert
          if (bulkBody.length >= batchSize * 2) {
            try {
              const response = await openSearchClient.bulk({ index: 'specs_rows', body: bulkBody });
              console.log(`Inserted ${i + 1} rows`);
              bulkBody.length = 0; // Clear the bulkBody to prepare for the next batch
              bulkBody = []
            } catch (error) {
              console.error('Error during bulk insert:', error);
            }
          }
        }
      
        // Insert any remaining rows (less than batchSize)
        if (bulkBody.length > 0) {
          try {
            const response = await openSearchClient.bulk({ body: bulkBody });
            console.log('Inserted remaining rows');
          } catch (error) {
            console.error('Error during bulk insert of remaining rows:', error);
          }
        }
    }


    try{
        await insertBulkData()
        return new Response('data inserted')
    }catch(error){
        return new Response('error inserting data'+error.message) 
    }
}

export async function GET() {

    try {
    // Fetch the first 5000 documents from the 'specs_rows' index
      const response = await openSearchClient.search({
        index: 'specs_rows', // Specify the index
        size: 5000, // Limit the number of documents returned to 5000
        body: {
          query: {
            match_all: {} // This will match all documents
          }
        }
      });

      const hashes = response.body.hits.hits
                    .map(({_source: {row}}) => row )
      
      // Return the documents in the response
      return new Response(JSON.stringify(hashes, response), { status: 200 });
      
    } catch (error) {
      
      console.error('Error fetching documents:', error);
      
      return new Response('Error fetching documents', { status: 500 });

    }
}

export async function DELETE(){
  try{
    const delResponse = await openSearchClient.deleteByQuery({
      index: 'specs_rows',
      body: {
        query: {
          match_all: {}
        }
      },
      refresh: true // ensures changes are immediately visible
    });

    return new Response(JSON.stringify(delResponse))

  }catch(error){
    return new Response('error deleting')
  }
}
