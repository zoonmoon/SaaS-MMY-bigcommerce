import openSearchClient from "../../_lib/opensearch";
import { fetchStoreData } from "../../merchant/stores/[store_hash]/indexing/fitment-data/fetch_store_data";

export async function GET(request) {
    try {

        const url = new URL(request.url);
        
        const product_id = url.searchParams.get("product_id");
        const storeHash = url.searchParams.get("store_hash");

        if (!storeHash || storeHash.trim() === '') {
            throw new Error('Store not defined');
        }

        let {columnContainingProductIDs} = await fetchStoreData(storeHash) 

        let must = [                    
            { term: { store_hash: storeHash } },
            {term: {[`row.${columnContainingProductIDs}`]: product_id }}
        ]
        
        const query = {
            bool: {
                must
            }
        };

        const response = await openSearchClient.search({
            index: 'specs_rows',
            body: {
                size: 10000,
                query // ← put directly here, not under another "query"
            }
        });
        
        let dataRow = response.body.hits.hits.map( ({_source}) => _source.row )
        
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