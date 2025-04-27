'use client'
import { useEffect, useState } from "react"
import { SpecsDropdownWidget } from "../specs-dropdown-widget";
import { Chip, Container, Grid, Paper } from "@mui/material";
import toast from 'react-hot-toast'
import ProductGrid from "./product-grid";
import PaginationWithMUI from "./pagination";
import ProductFilters from "./product-filters";
import LoadingSpinner from "../loading-spinner";
import { scrollToElementTopById } from "../../utils";

export default function ProductGridAndFilters(){

    const [productsAndFilters, setProductsAndFilters] = useState({products: [], filters: { allCategories:[], attributes: [], categories: [] }, totalResults: 0})
    const [selectedFilters, setSelectedFilters] = useState({page:1, categories: [], attributes: [], query: ''})
    const [isLoading, setIsLoading] = useState(false)


    const fetchProductsAndFilters = async (selectedSpecs = '') => {
        
        try{
           
            setIsLoading(true) 

            let endpoint = `${process.env.REACT_APP_API_URL}/api/storefront/product-listing-and-filters`

            let selectedFiltersString = JSON.stringify(selectedFilters)

            endpoint  = `${endpoint}?store_hash=${process.env.REACT_APP_STORE_HASH}&selectedFilters=${selectedFiltersString}&selectedSpecs=${selectedSpecs}`

            const response = await fetch(endpoint)
            
            const responseJSON = await response.json()

            setProductsAndFilters((prev) => ({
                products: responseJSON.products,
                totalResults: responseJSON.totalResults,
                filters: {
                  ...prev.filters, // Keep the existing filters properties
                  attributes: responseJSON.attributesFilters, // Update attributes
                  categories: responseJSON.categoriesAggregate, // Update categories
                }
              }));
            
            setIsLoading(false)

        }catch(error){
            toast(error.message)
        }finally{
            setIsLoading(false)
        }

    }

    async function fetchAllCategories(){

        let endpoint = `${process.env.REACT_APP_API_URL}/api/storefront/all-categories?store_hash=`+process.env.REACT_APP_STORE_HASH

        const response = await fetch(endpoint)

        const newAllCategoriesArray = await response.json()

        setProductsAndFilters(prev => ({
            ...prev, // Spread the previous state to retain all other properties
            filters: {
              ...prev.filters, // Spread the previous filters to retain other filter properties
              allCategories: newAllCategoriesArray // Update the allCategories field
            }
          }));

    }

    useEffect(()=>{
        fetchAllCategories() 
    }, [])

    useEffect(()=>{

        const urlParams = new URLSearchParams(window.location.search);
        const fits = urlParams.get('fits');
        if(fits !== null )
            fetchProductsAndFilters(fits)
        else 
            fetchProductsAndFilters()

    }, [selectedFilters])

    const handlePaginationClick = (newPage) => {

        scrollToElementTopById("product-grid-and-filters")

        setSelectedFilters(prev => ({
          ...prev,
          page: newPage
        }));

    };


    const handleAttributesClick = (newAttributes) => {
        scrollToElementTopById("product-grid-and-filters")

        setSelectedFilters(prev => ({
          ...prev,
          page: 1,
          attributes: newAttributes
        }));

    }

    const handleCategoryClick = (category) => {

        scrollToElementTopById("product-grid-and-filters")

        if(selectedFilters.categories.length){
            setSelectedFilters({...selectedFilters, categories: []});
        }else{
            setSelectedFilters({...selectedFilters, categories: [category]});
        }
    }

    const callBack = (selectedSpecs) => {
        window.location.href = '/compatible-parts?fits='+selectedSpecs;  //
    };
    
    return(
        <div>
            
            {
                isLoading && (<LoadingSpinner />)
            }

            <SpecsDropdownWidget 
                endpoint={`${process.env.REACT_APP_API_URL}/api/storefront/dropdown-specs`}
                callbackToSubmission={callBack}
                storeHash={process.env.REACT_APP_STORE_HASH}
                listingPage ={true}
            /> 
            
            <Grid  id="product-grid-and-filters" container spacing={2} sx={{marginTop:'20px'}}>
                {
                    <>
                        <Grid item size={{ xs: 12, md: 3 }}>
                            
                            <Paper sx={{padding:'10px'}}>
                                <div>Filters</div>
                                {
                                    Object.values(selectedFilters.attributes).length > 0 && (
                                        <div style={{display:'flex', marginTop:'10px', flexWrap:'wrap', gap:'10px'}}>
                                            {
                                                selectedFilters.attributes.flatMap((attr) =>
                                                    attr.values.map((value, index) => (
                                                        <Chip
                                                            key={`${attr.key}-${value}`}
                                                            label={`${attr.key}: ${value}`}
                                                            variant="outlined"
                                                        />
                                                    ))
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </Paper>
                            
                            <div style={{marginTop:'20px'}}>
                                <ProductFilters 
                                    productFilters={productsAndFilters.filters} 
                                    selectedFilters={selectedFilters}
                                    handleAttributesClick={handleAttributesClick}
                                    handleCategoryClick={handleCategoryClick}
                                />
                            </div>

                        </Grid>

                        <Grid item size={{ xs: 12, md: 9 }}>
                            
                            <Paper elevation={1} sx={{padding:'10px', marginBottom:'10px'}}>
                                {(selectedFilters.page - 1) * 24 + 1} - {Math.min(selectedFilters.page * 24, productsAndFilters.totalResults)}  of  {productsAndFilters.totalResults} results                            
                            </Paper>

                            <ProductGrid products={productsAndFilters.products} />

                            <div style={{display:'flex', marginTop:'20px', marginBottom:'20px', justifyContent:'center'}}>
                                
                                <PaginationWithMUI 
                                    totalProducts={productsAndFilters.totalResults} 
                                    productsPerPage={24}
                                    handlePaginationClick={handlePaginationClick}
                                    currentPage={selectedFilters.page}
                                />

                            </div>

                        </Grid>
                    </>
                }
            </Grid>
        </div>
    )    
}