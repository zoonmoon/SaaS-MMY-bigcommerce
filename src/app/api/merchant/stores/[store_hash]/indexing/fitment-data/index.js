import { chunkArray } from "../product-catalog/fetch_products";
import { fetchFitmentSheet } from "./fetch_google_sheet";
import { fetchStoreData } from "./fetch_store_data";
import { hashVsNewData } from "./hash_vs_data";
import { validateSpreadsheetURL } from "../../update-google-sheet-url/route";
import openSearchClient from "@/app/api/_lib/opensearch";
import { updateSearchKeywords } from "./update-search-keywords";


export async function syncFitmentData(storeHash){

    try{
        
        let storeData = await fetchStoreData(storeHash) 

        if(!('access_token' in storeData )) throw new Error('Access token not found')
        
        let accessToken = storeData.access_token
    
        if(!('selectedDropdownFilters' in storeData )) throw new Error('store lacks dropdown filters')
        
        let selectedDropdownFilters = storeData.selectedDropdownFilters || []
        
        if(selectedDropdownFilters.length == 0) throw new Error("Store lacks dropdown filters")
        
        let columnContainingProductIDs = storeData?.columnContainingProductIDs || ''

        if(columnContainingProductIDs == '') throw new Error("Store lacks column containing product IDs")
        
        let spreadSheetURL = storeData.spreadsheet_url 

        validateSpreadsheetURL(spreadSheetURL) 
        // the above function throws error if not valid URL
        // so it moves to catch block if error in url 

        let newFitmentData = await fetchFitmentSheet(spreadSheetURL);

        // let existingFitmentData = await fetchFitmentDataFromDatabase();
        
        let {hashesVsRows: hashesVsNewFitmentData, pidVsHashes}  = hashVsNewData(selectedDropdownFilters, columnContainingProductIDs,  newFitmentData)
        
        await openSearchClient.deleteByQuery({
            index: 'specs_rows',
            body: {
              query: {
                term: {
                  store_hash: storeHash
                }
              }
            }
        });

        const chunks = chunkArray(Object.values(hashesVsNewFitmentData).map(row => ({store_hash: storeHash, row})), 5000);

        for (const chunk of chunks) {

            const body = chunk.flatMap(doc => [
                { index: {} },
                doc
            ]);

            const response = await openSearchClient.bulk({index: 'specs_rows', body });

        }

        await updateSearchKeywords(pidVsHashes, storeHash, accessToken)
        
        
        // new data
        // old data
        // find to be deleted
        // find to be added new 

    }catch(error){

        console.log(error)

        throw error 

    }
}