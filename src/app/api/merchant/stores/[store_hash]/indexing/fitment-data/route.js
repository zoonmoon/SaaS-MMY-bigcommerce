import { syncFitmentData } from "."

export async function GET(request, {params}){
    try{
        const {store_hash} = await params 
        await syncFitmentData(store_hash)
        return new Response(JSON.stringify({success: true, message: "Fitment data synchronized"}))
    }catch(error){
        return new Response(JSON.stringify({success:false, message: "Error synchronizing fitment data"}))
    }
}