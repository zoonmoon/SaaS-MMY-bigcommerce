import openSearchClient from "../../_lib/opensearch";
import { fetchStoreData } from "../../merchant/stores/[store_hash]/indexing/fitment-data/fetch_store_data";

export async function GET(request) {
    try {
        const url = new URL(request.url);
        
        const selectedSpecsInfo = url.searchParams.get("hash");
        const storeHash = url.searchParams.get("store_hash");

        if (!storeHash || storeHash.trim() === '') {
            throw new Error('Store not defined');
        }

        let must = [                    
            { term: { store_hash: storeHash } },
        ]
        
        var selectedSpecsInfoArr = selectedSpecsInfo.split('::') // key:val separaated by :: 

        selectedSpecsInfoArr.forEach(selectedVehicleSpec => {
            let [key, val] = selectedVehicleSpec.split(':') 
            must.push({ term: { [`row.${key}.value_key`]: val.toLowerCase() }});
        })
        const query = {
            bool: {
                must
            }
        };

        const response = await openSearchClient.search({
            index: 'specs_rows',
            body: {
                size: 1,
                query // ← put directly here, not under another "query"
            }
        });

        let dataRow=    response.body.hits.hits[0]._source.row

        let {selectedDropdownFilters} = await fetchStoreData(storeHash)

        let selectedSpecsLabels =  selectedDropdownFilters
            .sort((a,b) => a.sort_order - b.sort_order)
            .map(({key}) => dataRow[key].value_label  )
            .join(' ')

        return new Response(JSON.stringify({ success: true, query, selectedSpecsLabels }), {
            headers: { 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500
        });
    }
}