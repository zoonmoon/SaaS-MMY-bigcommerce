import { syncProductCatalog } from "./sync_catalog"

export async function GET(request, {params}){
    try{
        // const {store_hash} = await params 
        // await syncProductCatalog(store_hash)
        return new Response(JSON.stringify({success: true, message: "Product Catalog synchronized"}))
    }catch(error){
        console.log(error.message)
        return new Response(JSON.stringify({success:false, message: "Error synchronizing product catalog"}))
    }
}