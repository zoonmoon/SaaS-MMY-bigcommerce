export async function updateSearchKeywords(pidVsHashes, storeHash, accessToken, hashesToAddToDatabase) {
    
    const BIGCOMMERCE_API_URL = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`;
    const AUTH_TOKEN = accessToken;
    

    for (const [pid, hashes] of Object.entries(pidVsHashes)) {

        if( !(hashes.some(hash => hashesToAddToDatabase.includes(hash)))) continue 

    const searchKeywords = hashes.join(',');

        try {

            const response = await fetch(`${BIGCOMMERCE_API_URL}/${pid}`, {
                method: 'PUT',
                headers: {
                    'X-Auth-Token': AUTH_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ search_keywords: searchKeywords })
// IMPORTANT: in case the product does not show while selecting ymm, layout_file can be a culprit 
                //body: JSON.stringify({ search_keywords: searchKeywords, layout_file: 'product.html' })
            });
            
            if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorBody)}`);
            }

            const data = await response.json();

            // console.log(`✅ Updated product ${pid}`, data);

        } catch (err) {
            
            console.error(`❌ Failed to update product ${pid}:`, err.message);

        }

    }

}