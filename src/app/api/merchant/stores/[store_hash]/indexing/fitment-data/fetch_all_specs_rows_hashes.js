import openSearchClient from "@/app/api/_lib/opensearch";

export async function fetchAllSpecsRowsHashes(storeData){
    
    const{ store_hash} = storeData

    const must = [
        { term: { store_hash: store_hash } }
    ];
    
    const query = { bool: { must } };

    const uniqueHashes = {}

    // Initial search with scroll
    const initialResponse = await openSearchClient.search({
        index: 'specs_rows',
        scroll: '1m',
        body: {
            size: 1000,
            query
        }
    });

    let scrollId = initialResponse.body._scroll_id;
    let hits = initialResponse.body.hits.hits;

    // Process initial batch
    for (const hit of hits) {
        const hash = hit._source.row?.hash;
        uniqueHashes[hash] =  hit._id;
    }

    // Continue scrolling until no more hits
    while (hits.length > 0) {
        const scrollResponse = await openSearchClient.scroll({
            scroll_id: scrollId,
            scroll: '1m'
        });

        scrollId = scrollResponse.body._scroll_id;
        hits = scrollResponse.body.hits.hits;

        // Process initial batch
        for (const hit of hits) {
            const hash = hit._source.row?.hash;
            uniqueHashes[hash] =  hit._id;
        }

    }

    // Clean up
    await openSearchClient.clearScroll({ scroll_id: scrollId });

    return uniqueHashes;

}