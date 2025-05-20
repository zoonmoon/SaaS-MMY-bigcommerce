import openSearchClient from "@/app/api/_lib/opensearch";

export async function deleteSearchKeywords(storeData){
    
    const{ access_token, columnContainingProductIDs, store_hash} = storeData

    const must = [
        { term: { store_hash: store_hash } }
    ];

    const query = { bool: { must } };

    const uniqueProductIDs = new Set();

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
        const productIDs = hit._source.row?.[columnContainingProductIDs];
        if (Array.isArray(productIDs)) {
            productIDs.forEach(id => uniqueProductIDs.add(id));
        }
    }

    // Continue scrolling until no more hits
    while (hits.length > 0) {
        const scrollResponse = await openSearchClient.scroll({
            scroll_id: scrollId,
            scroll: '1m'
        });

        scrollId = scrollResponse.body._scroll_id;
        hits = scrollResponse.body.hits.hits;

        for (const hit of hits) {
            const productIDs = hit._source.row?.[columnContainingProductIDs];
            if (Array.isArray(productIDs)) {
                productIDs.forEach(id => uniqueProductIDs.add(id));
            }
        }
    }

    // Clean up
    await openSearchClient.clearScroll({ scroll_id: scrollId });

    const uniqueProductIDsArr =  Array.from(uniqueProductIDs);

    const baseUrl = `https://api.bigcommerce.com/stores/${store_hash}/v3/catalog/products`;

    for (const productId of uniqueProductIDsArr) {
        await fetch(`${baseUrl}/${productId}`, {
            method: 'PUT',
            headers: {
                'X-Auth-Token': access_token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                search_keywords: ''
            })
        });
    }

}