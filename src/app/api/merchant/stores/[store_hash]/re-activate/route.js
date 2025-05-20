import { updateDoc } from "@/app/api/_lib/opensearch/update_doc"
import { fetchStoreData } from "../indexing/fitment-data/fetch_store_data"

export async function POST(request, {params}){

    // de-activates store

    try{    

        const {store_hash} = await params 
        
        const {id} = await fetchStoreData(store_hash)

        await updateDoc('stores', id, { active_status: "active"})
        
        return new Response(JSON.stringify({success: true, message: "Store reactivated"}))
        
    }catch(error){

        return new Response(JSON.stringify({success: false, message: error.message}))
    
    }

}