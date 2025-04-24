import openSearchClient from "../../_lib/opensearch";

import { productsSchema, categoriesSchema, specs, specsRows, usersSchema, storesSchema } from "./schema";

export async function GET(){
    try{
        
        const response = await openSearchClient.cat.indices({ v: true, h: 'index' });

        return new Response(JSON.stringify({indices: response.body})) 

    }catch(error){

        return new Response(JSON.stringify({success: false, msg: error.message}))

    }
}

export async function POST(){

    try{

        // await openSearchClient.indices.create(
        //     {
        //         index: 'product',
        //         body: {
        //             mappings: productsSchema
        //         }
        //     }
        // )
        
        // await openSearchClient.indices.create(
        //     {
        //         index: 'catgory',
        //         body: {
        //             mappings: categoriesSchema
        //         }
        //     }
        // )

        // await openSearchClient.indices.create(
        //     {
        //         index: 'specs',
        //         body: {
        //             mappings: specs
        //         }
        //     }
        // )
        
        // await openSearchClient.indices.create(
        //     {
        //         index: 'users',
        //         body: {
        //             mappings: usersSchema
        //         }
        //     }
        // )        
        
        // await openSearchClient.indices.create(
        //     {
        //         index: 'stores',
        //         body: {
        //             mappings: storesSchema
        //         }
        //     }
        // )        


        // await openSearchClient.indices.create(
        //     {
        //         index: 'specs_rows',
        //         body: {
        //             mappings: specsRows
        //         }
        //     }
        // )
        
        return new Response(JSON.stringify({success: true})) 

    }catch(error){

        return new Response(JSON.stringify({success: false}))
        
    }

}

export async function PUT(){

}