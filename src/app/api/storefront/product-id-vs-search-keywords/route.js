import openSearchClient from "../../_lib/opensearch";
import { fetchStoreData } from "../../merchant/stores/[store_hash]/indexing/fitment-data/fetch_store_data";

async function fetchSearchKeywords(STORE_HASH, ACCESS_TOKEN, PRODUCT_ID){
    const url = `https://api.bigcommerce.com/stores/${STORE_HASH}/v3/catalog/products/${PRODUCT_ID}`;

    const response = await fetch(url, {
    headers: {
        'X-Auth-Token': ACCESS_TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    })
    
    let data =await response.json()
    
    console.log("data", data) 
    
    if(data.data.id != PRODUCT_ID) throw new Error("Error fetching search keywords")

    return data.data.search_keywords


}


export async function GET(request) {
    try {

        const url = new URL(request.url);
        
        const product_id = url.searchParams.get("product_id");
        const storeHash = url.searchParams.get("store_hash");

        if (!storeHash || storeHash.trim() === '') {
            throw new Error('Store not defined');
        }

        let {access_token} = await fetchStoreData(storeHash) 

        let searchKeywords = await fetchSearchKeywords(storeHash, access_token, product_id)
        console.log("searchkeywods",searchKeywords)
        return new Response(JSON.stringify({ success: true, searchKeywords }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}