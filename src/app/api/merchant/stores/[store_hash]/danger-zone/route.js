import { updateDoc } from "@/app/api/_lib/opensearch/update_doc"
import { fetchStoreData } from "../indexing/fitment-data/fetch_store_data"

import openSearchClient from "@/app/api/_lib/opensearch"

import { deleteSearchKeywords } from "./utils"
import { deleteAllWidgetsAndTemplates } from "../bigcommerce-integration/widget-manager/utils"

import { deleteScriptsFromBigCommerce } from "../bigcommerce-integration/script-manager/utils"

export async function POST(request, {params}){

    // de-activates store
    try{    
        
        const {store_hash} = await params 
        
        const storeData = await fetchStoreData(store_hash)
        
        await updateDoc('stores', storeData.id, {active_status: "inactive"})

        await deleteSearchKeywords(storeData) 

        await deleteAllWidgetsAndTemplates(storeData.store_hash, storeData.access_token)

        await deleteScriptsFromBigCommerce(store_hash, storeData.access_token)

        
        await openSearchClient.deleteByQuery({
            index: 'specs_rows',
            body: {
              query: {
                term: {
                  store_hash: store_hash
                }
              }
            }
        });

        return new Response(JSON.stringify({success: true, message : "Store deactivated"}))
        
    }catch(error){
        
        return new Response(JSON.stringify({success: false, message: 'Error: ' + error.message}))
        
    }

}