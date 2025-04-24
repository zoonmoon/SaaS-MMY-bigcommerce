import openSearchClient from "@/app/api/_lib/opensearch"

import { productsSchema } from "../../schema"

import { generateProductRow } from "./fake";

export async function POST(){

    
    try{
        const bulkBody = [];

        for (let i = 0; i < 1000; i++) {
            // Add the action and row data to the bulk body
            bulkBody.push({ index: {} });  // Action for bulk insert
            bulkBody.push(generateProductRow(i));  // Row data to insert
        }
        
        console.log(bulkBody);

        // return  new Response(JSON.stringify(bulkBody))
        const response = await openSearchClient.bulk({ index: 'product', body: bulkBody });
        
        return new Response('Products inserte in bulk ' + JSON.stringify(bulkBody))

    }catch(error){
        return new Response('Error inserting products')
    }
}

export async function GET() {

    try {

        const page = 1; // Current page number
        const pageSize = 24; // Number of products per page
        
        const response = await openSearchClient.search({
            index: 'product', 
            size: pageSize, 
            from: (page - 1) * pageSize, 
            body: {
                query: {
                    match_all: {}
                },
                aggs: {
                    categories: {
                        terms: {
                            field: 'categories', // Direct aggregation on categories field
                            size: 10000 // Adjust size limit as necessary
                        }
                    },
                    attributes: {
                        nested: {
                            path: 'attributes' // Use nested path for attributes
                        },
                        aggs: {
                            attribute_key: {
                                terms: {
                                    field: 'attributes.key', // Aggregate by key field in attributes
                                    size: 10000 // Adjust size limit for keys
                                },
                                aggs: {
                                    attribute_values: {
                                        terms: {
                                            field: 'attributes.value_key', // Aggregate by value_key
                                            size: 10000 // Adjust size limit for values
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        // Return the documents in the response
        return new Response(JSON.stringify(response), { status: 200 });
        
    } catch (error) {
        
        console.error('Error fetching documents:', error);
        
        return new Response('Error fetching documents', { status: 500 });

    }
}

export async function PUT(){
    try{

        const putSchemaResponse = await openSearchClient.indices.putMapping({
            index: 'product',
            body: productsSchema
        })

        return new Response('Schema updated')

    }catch(error){

        return new Response('Schema updation failed'+error.message) 

    }

}


export async function DELETE(){
    return 
    try{

        const delResponse = await openSearchClient.indices.delete({
            index: 'product'
        });

        await openSearchClient.indices.create(
            {
                index: 'product',
                body: {
                    mappings: productsSchema
                }
            }
        )
        
        return new Response(JSON.stringify({delResponse}))
  
    }catch(error){
    
        return new Response('error deleting')
    
    }
}
  