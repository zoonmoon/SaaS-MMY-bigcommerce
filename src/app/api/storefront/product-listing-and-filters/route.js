import openSearchClient from "../../_lib/opensearch";
import { buildOpenSearchQuery } from "./build_query";

export async function GET(request){

    try{
        
        const url = new URL(request.url)        
        const selectedSpecsString = url.searchParams.get("selectedSpecs")
        const selectedFiltersString = url.searchParams.get("selectedFilters")
        const storeHash = url.searchParams.get("store_hash")
        const selectedFiltersJSON = JSON.parse(selectedFiltersString) 
        
        // const selectedCategories = [1, 2];
        const selectedCategories  = selectedFiltersJSON.categories

        const currentPage = selectedFiltersJSON.page

        const selectedFitsOnSpecs = selectedSpecsString
        .split("::")
        .filter(spec => spec.trim().length > 0 )
        .map(pair => {
          const [key, value] = pair.split(":");
          return { key, value };
        });      

        // const selectedFitsOnSpecs = [
        //     { key: "year", value: "2017" },
        // ];


        const selectedAttributes = selectedFiltersJSON.attributes
        // const selectedAttributes = [
        //     { key: "size", values: ["xl"] },
        //     { key: "lift-weight", values: ["3-kg"] }
        // ];

        console.log("selectedFitsOnSpecs", selectedFitsOnSpecs)

        const query = buildOpenSearchQuery({
            storeHash,
            selectedCategories,
            selectedFitsOnSpecs,
            selectedAttributes,
            currentPage
        });

        const result = await openSearchClient.search({
            index: 'product',
            body: query
        });
        
        const products = result.body.hits.hits.map(({_source}) => _source )

        const totalResults = result.body.hits.total.value

        const attributesFilters = []

        result.body.aggregations.attributes.by_key.buckets.forEach(bucket => {
            
            const attribute = {
                key: bucket.key, 
                label: bucket.key, // to-do
                total_hits: bucket.doc_count,
                values: []
            }

            attribute.values = bucket.values.buckets.map(({key, doc_count}) => (
                {
                    key, 
                    label: key , // to-do
                    total_hits: doc_count
                }
            ))

            attributesFilters.push(attribute)
            
        })

        const categoriesAggregate = []

        result.body.aggregations.categories.buckets.forEach(bucket => {
            categoriesAggregate.push(bucket)
        });

        return new Response(JSON.stringify({ categoriesAggregate, result, attributesFilters, query, products, totalResults }))

    }catch(error){
    
        return new Response("error - " + error.message )
    
    }

}