import { fetchStoreData } from "../../indexing/fitment-data/fetch_store_data";
import { bigCScriptsCreatedUsingThisAccessToken, createRequiredScriptsInBigCommerce } from "./utils";
import { requiredScripts } from "./data";
import { deleteScriptsFromBigCommerce } from "./utils";


export async function POST(request, {params}){

    // build script for this store
    // save the built script inside public folder
    // upload the link to that script to the script manager in BigCommerce

    try{    
        
        const {store_hash} = await params 
        
        const {access_token} = await fetchStoreData(store_hash) 
        
        let scriptsAlreadyCreated = await bigCScriptsCreatedUsingThisAccessToken(store_hash, access_token)
        
        scriptsAlreadyCreated = scriptsAlreadyCreated.map(({name}) => name)

        console.log("scriptsalreadycreated")
        console.log(scriptsAlreadyCreated)

        await createRequiredScriptsInBigCommerce(
            store_hash,
            access_token,
            'https://ymmfinder.com',
            requiredScripts.filter(script => !(scriptsAlreadyCreated.includes(script)))
        )   

        return new Response(JSON.stringify({success: true, message: "Script added in BigCommerce"}))

    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}

export async function GET(request, {params}){
    
    try{

        const {store_hash} = await params 

        // get store data
        // it should contain the flag for whether the script has been added in bigcommerce

        const {access_token} = await fetchStoreData(store_hash) 

        let scriptsAlreadyCreated = await bigCScriptsCreatedUsingThisAccessToken(store_hash, access_token)
        
        scriptsAlreadyCreated = scriptsAlreadyCreated.map(({name}) => name)

        return new Response(JSON.stringify({success: true, is_script_added_in_bc: requiredScripts.every(reqScript => scriptsAlreadyCreated.includes(reqScript))}))

    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}

export async function DELETE(request, {params}){

    try{

        const {store_hash} = await params 

        // get store data
        // it should contain the flag for whether the script has been added in bigcommerce

        const {access_token} = await fetchStoreData(store_hash) 

        await deleteScriptsFromBigCommerce(store_hash, access_token) 

        return new Response(JSON.stringify({success: true}))

    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}