import openSearchClient from "../../_lib/opensearch"
import { fetchStoreData } from "../../merchant/stores/[store_hash]/indexing/fitment-data/fetch_store_data";

export async function OPTIONS(req) {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function GET(request){

    try{

        const url = new URL(request.url)
        
        const selectedSpecsInfo = url.searchParams.get("selected_specs_info")
      
        const storeHash = url.searchParams.get("store_hash") 

        if(!storeHash || storeHash == null || storeHash == undefined || storeHash == '' )
            throw new Error('Store not defined')

        let specToFetch = url.searchParams.get('spec_to_fetch')
        
        let responseContainsValidSpecsSettings = false 

        let specsSettings = []

        if( selectedSpecsInfo == null || !selectedSpecsInfo ||  selectedSpecsInfo == undefined || selectedSpecsInfo.trim().length == 0 ){
            
            // it means the first spec is being fetched, as not any spec has been selected yet

            // to find which one is the first spec, fetch settings

            // const result = await openSearchClient.search({
            //     index: 'specs',
            //     body: {
            //       query: {
            //         term: {
            //           store_hash: storeHash
            //         }
            //       }
            //     }
            // });

            let storeData = await fetchStoreData(storeHash) 

            let matchingSpecsSettings =  storeData.selectedDropdownFilters

            if(matchingSpecsSettings.length > 0){
                                
                // sometimes there can be duplicate entries by mistake
                // meaning two sets of settings for a single store
                // in that case, choose whatever comes first

                specsSettings = matchingSpecsSettings
                
                responseContainsValidSpecsSettings = true 

                var specToFetchObjArr = matchingSpecsSettings.filter(spec => parseInt(spec.sort_order) === 0)

                if(specToFetchObjArr.length > 0){
                    
                    var specToFetchObj = specToFetchObjArr[0] 
                    
                    specToFetch = specToFetchObj.key
                    
                }

            }

        }
        
        // at this point it should be clear which spec to fetch 

        if( !specToFetch || specToFetch == null || specToFetch == undefined || specToFetch.trim().length == 0 )
            throw new Error('Spec to fetch was not determinable')
        
        const must = [{ term: { store_hash: storeHash } }]; // must is the filter param to be used in  opensearch query
        // store_hash is a prop for each document in the index specs_rows

        // selectedSpecsInfo ~ 'year:2019::make:2018'
        if(selectedSpecsInfo && selectedSpecsInfo !== null && selectedSpecsInfo !== undefined && selectedSpecsInfo.trim().length > 0 ){
            var selectedSpecsInfoArr = selectedSpecsInfo.split('::') // key:val separaated by :: 
            selectedSpecsInfoArr.forEach(selectedVehicleSpec => {
                let [key, val] = selectedVehicleSpec.split(':') 
                must.push({ term: { [`row.${key}.value_key`]: val } });
            })
        }

        const query = { bool: { must } }

        const aggs = {
            unique_key_values: {
              terms: {
                field: `row.${specToFetch}.value_key.keyword`,
                size: 1000 // max number of unique values you want
              },
              aggs: {
                unique_key_labels: {
                  terms: {
                    field: `row.${specToFetch}.value_label.keyword` // Get the label as well
                  }
                }
              }
            }
          }

        const response = await openSearchClient.search({
            index: 'specs_rows',
            body: {
              size: 0, // cause we don't need, the info we need is in aggs itself
              query,
              aggs
            }
        });

        const dropdownData = {}

        dropdownData['spec'] = specToFetch

        dropdownData['entries'] = [] 

        response.body.aggregations.unique_key_values.buckets.forEach(({key, unique_key_labels}) => {
            dropdownData['entries'].push({value: key, label: unique_key_labels.buckets[0].key})
        })

        return new Response(
            JSON.stringify({ dropdownData, responseContainsValidSpecsSettings, specsSettings})
        )
        
    }catch(error){

        return new Response(JSON.stringify({success:false, error: error.message})) 
        
    }   

}