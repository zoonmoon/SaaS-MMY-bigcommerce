import { fetchStoreData } from "../../indexing/fitment-data/fetch_store_data";

export async function POST(request, {params}){

    // build script for this store
    // save the built script inside public folder
    // upload the link to that script to the script manager in BigCommerce
    try{    
        
        return new Response(JSON.stringify({success: true, message: "Script added in BigCommerce"}))
        
    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}

export async function PUT(request, {params}){

    // build script for this store
    // save the built script inside public folder
    // upload the link to that script to the script manager in BigCommerce
    
    try{    
        
        const {store_hash} = await params 

        return new Response(JSON.stringify({success: true, message: "Script updated. Please hard refresh in storefront to see effect."}))
        
    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}

export async function GET(request, {params}){

    try{

        const {store_hash} = await params 

        // get store data
        // it should contain the flag for whether the script has been added in bigcommerce

        const storeData = await fetchStoreData(store_hash) 

        let is_script_added_in_bc = false 

        if(storeData.is_script_added_in_bc != undefined)
            is_script_added_in_bc = storeData.is_script_added_in_bc == "true" ? true :false 

        return new Response(JSON.stringify({success: true, is_script_added_in_bc}))

    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}