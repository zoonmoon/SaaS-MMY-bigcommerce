import { sanitizeString } from "@/app/api/_lib/misc/utils"
import openSearchClient from "@/app/api/_lib/opensearch"

// Function to split array into chunks
export function chunkArray(arr, chunkSize) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
}

export async function fetchProducts(storeHash, accessToken, lastSynchronizedAt = ''){

    try{

        let params = [
            'include=custom_fields,images', 
            'limit=250',
            'is_visible=true'
        ]

        let productsToBeCreated = []

        let currentPage = 1

        while(true){
            
            params.push(`page=${currentPage}`)

            let filters = params.join('&')

            let apiUrl = `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products?${filters}`

            const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'X-Auth-Token': accessToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            )
            
            const responseJSON =  await response.json() 

            if(!('data' in responseJSON)) throw new Error('FPRODATAERR - Error fetching products data') 
            
            let products = responseJSON.data
            
            products.forEach(product => {
       
                let productWithRequiredProps = {

                    store_hash: storeHash,
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    link: product.custom_url.url,
                    thumbnail: product.images.length > 0 
                                ? product.images.filter(image => image.is_thumbnail === true )[0]?.url_standard ?? ''
                                : '',
                    price: product.price,
                    sale_price: product.sale_price,
                    fitment_data: [],
                    attributes: [
                        ...product.custom_fields.map(cf => ({
                            key: sanitizeString(cf.name),
                            label: cf.name,
                            value_key: sanitizeString(cf.value),
                            value_label: cf.value
                        })).filter(attr => attr.key.trim().length > 0 && attr.value_key.trim().length > 0 ),
                        {
                            key: "Condition", label: "Condition",
                            value_key: sanitizeString(product.condition), value_label: product.condition 
                        },
                        {
                            key: "Featured", label: "Featured Products",
                            value_key: product.is_featured, value_label: product.is_featured
                        },
                        {
                            key: "Availability", label: "Availability",
                            value_key: sanitizeString(product.availability), value_label: product.availability
                        },
                    ]
                }

                // to-do 
                productsToBeCreated.push(productWithRequiredProps)

            });

            if(!('meta' in responseJSON )) throw new Error("METACHECKERR - Error fetching products data")

            let meta = responseJSON.meta 

            if(!('pagination' in meta)) throw new Error("PAGINATEERR - Error fetching products")
            
            let pagination = meta.pagination 
            
            if(!('current_page' in pagination)) throw new Error('Error fetching products Pagination Error') 
            
            if(
                pagination.total_pages == currentPage ||  
                products.length == 0  || 
                products.length != 250
            ) 
                break 

            currentPage += 1

        }

        const resp = await openSearchClient.deleteByQuery({
            index: 'product',
            body: {
              query: {
                term: {
                  store_hash: storeHash
                }
              }
            }
        });

        console.log("storeHash", storeHash)
        console.log("del response", resp)
        console.log("products to be created", productsToBeCreated.length ) 
         
        const chunks = chunkArray(productsToBeCreated, 5000);

        for (const chunk of chunks) {
            
            const body = chunk.flatMap(doc => [
                { index: {} },
                doc
            ]);

            await openSearchClient.bulk({index: 'product', body });
            
        }

    }catch(error){
    
        console.log(error)
        throw error
    
    }

}