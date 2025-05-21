import { chunkArray } from "../product-catalog/fetch_products";
import { fetchFitmentSheet } from "./fetch_google_sheet";
import { fetchStoreData } from "./fetch_store_data";
import { hashVsNewData } from "./hash_vs_data";
import { validateSpreadsheetURL } from "../../update-google-sheet-url/route";
import { updateSearchKeywords } from "./update-search-keywords";
import { fetchAllSpecsRowsHashes } from "./fetch_all_specs_rows_hashes";
import openSearchClient from "@/app/api/_lib/opensearch";

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
        
        let hashesVsIDFromDatabase = await fetchAllSpecsRowsHashes(storeData)

        let hashesFromDatabase = Object.keys(hashesVsIDFromDatabase)

        let hashesFromGoogleSheet = [...new Set(Object.keys(hashesVsNewFitmentData))]

        let sameHashesButDifferentPids = []

        // Hashes to delete from the database: present in DB but not in Google Sheet
        let hashesToDeleteFromDatabase = hashesFromDatabase.filter(hash => {
          
          if(!hashesFromGoogleSheet.includes(hash))
            return true 

          // includes but check if product IDs are different
          let productIDsFromSheet = hashesVsNewFitmentData[hash][columnContainingProductIDs]

          let productIDsFromDatabase = hashesVsIDFromDatabase[hash][columnContainingProductIDs] 

          if(
            productIDsFromSheet.length === productIDsFromDatabase.length &&
            productIDsFromSheet.every(id => productIDsFromDatabase.includes(id)) &&
            productIDsFromDatabase.every(id => productIDsFromSheet.includes(id))
          ){
            return false // they are same 
          }
          
          sameHashesButDifferentPids.push(hash) // product ids  are different
          return true  

        });
        
        // console.log("hashesToDeleteFromDatabase")
        // console.log(hashesToDeleteFromDatabase) 
        
        // Hashes to add to the database: present in Google Sheet but not in DB
        let hashesToAddToDatabase = hashesFromGoogleSheet.filter(hash => !hashesFromDatabase.includes(hash));
        
        console.log("sameHashesButDifferentPids", sameHashesButDifferentPids)

        hashesToAddToDatabase = [...hashesToAddToDatabase, ...sameHashesButDifferentPids]
        
        // console.log("hashesToAddToDatabase")
        // console.log(hashesToAddToDatabase)
        
        if (hashesToDeleteFromDatabase.length > 0){

          var documentIDsToDelete = hashesToDeleteFromDatabase.map(hash => hashesVsIDFromDatabase[hash].doc_id)

          const body = documentIDsToDelete.flatMap(id => [
            { delete: { _index: 'specs_rows', _id: id } }
          ]);

          const response = await openSearchClient.bulk({ refresh: true, body });

          console.log(response)
        
        }
        
        if(hashesToAddToDatabase.length == 0 ) return 
        
        const chunks = chunkArray(
          Object.values(hashesVsNewFitmentData)
          .filter(r => hashesToAddToDatabase.includes(r.hash))
          .map(row => ({store_hash: storeHash, row}))
        , 5000);

        for (const chunk of chunks) {

            const body = chunk.flatMap(doc => [
                { index: {} },
                doc
            ]);
            
            const response = await openSearchClient.bulk({index: 'specs_rows', body });

        }
        
        await updateSearchKeywords(pidVsHashes, storeHash, accessToken, hashesToAddToDatabase)
        
        // new data
        // old data
        // find to be deleted
        // find to be added new
        
    }catch(error){

        console.log(error)

        throw error 

    }
}