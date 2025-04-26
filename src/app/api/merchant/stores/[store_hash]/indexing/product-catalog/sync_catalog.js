import { fetchStoreData } from "../fitment-data/fetch_store_data";
import { fetchProducts } from "./fetch_products";

export async function syncProductCatalog(storeHash){

    try{
        

        let storeData = await fetchStoreData(storeHash) 

        if(!('access_token' in storeData )) throw new Error('Access token not found')

        let accessToken = storeData.access_token

        if(!accessToken || accessToken == null || accessToken.trim().length == 0) throw new Error('Invalid access token')

        let products = await fetchProducts(storeHash, accessToken)  

    }catch(error){
        throw error
    }
}