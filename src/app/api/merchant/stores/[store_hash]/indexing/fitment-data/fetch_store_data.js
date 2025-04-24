import openSearchClient from "@/app/api/_lib/opensearch";

export async function fetchStoreData(storeHash){

    try{

        // Check for duplicate store_hash for this username
        const existing = await openSearchClient.search({
            index:'stores',
            body: {
                query: {
                bool: {
                    must: [
                        { term: { store_hash: storeHash } }
                    ]
                }
                }
            }
        });
        
        if (existing.body.hits.total.value  ==  0) 
            throw new Error('Store not found')

        let storeData = existing.body.hits.hits.map(s => ({id: s._id, ...s._source}))[0]
        
        return storeData

    }catch(error){
        throw new Error(error.message)
    }


}
