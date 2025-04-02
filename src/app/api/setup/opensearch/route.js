import openSearchClient from "../../_lib/opensearch";

import { productsSchema, categoriesSchema } from "./schema";

export async function POST(){
    
    try{

        await openSearchClient.indices.create(
            {
                index: 'product',
                body: {
                    mappings: productsSchema
                }
            }
        )

        await openSearchClient.indices.create(
            {
                index: 'catgory',
                body: {
                    mappings: categoriesSchema
                }
            }
        )

        return new Response(body = "indices created") 

    }catch(error){

        return new Response(body = "failed")
        
    }

}


export async function PUT(){
    
}