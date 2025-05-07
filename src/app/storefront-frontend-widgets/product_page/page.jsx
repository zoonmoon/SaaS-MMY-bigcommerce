'use client'

import { useEffect, useState } from "react";
import { SpecsDropdownWidget } from "../components/specs-dropdown-widget";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { LoadingSpinner } from "../components/loading-spinner";
import { Alert } from "@mui/material";

export default function SpecsDropdownWidgetProductPage({widgetProps = {}}){

    const { product_id = '1476'} = widgetProps;

    const [searchKeywords, setSearchKeywords] = useState('')
    let [selectedSpecs, setSelectedSpecs] = useState('')

    let [selectedSpecsLabels, setSelectedSpecsLabels] = useState('')

    const callBack = (selectedSpecs) => {
        setSelectedSpecsLabels(selectedSpecs.split('::').map(a => a.split(':')[1]).join(' '))
        setSelectedSpecs(selectedSpecs)
    };

    const [isLoadingProductSearchKeywords, setIsLoadingProductSearchKeywords] = useState(true) 

    async function fetchSearchKeywords(){
    
        setIsLoadingProductSearchKeywords(true)

        try{

            let queryparams = []
            queryparams.push(`store_hash=${process.env.NEXT_PUBLIC_STORE_HASH}`)
            queryparams.push(`product_id=${product_id}`) 
            queryparams.join('&')
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/product-id-vs-search-keywords?${queryparams.join('&')}`)
            
            const responseJSON = await response.json()

            if(responseJSON.success !== true) throw new Error(responseJSON.message) 
            
            setSearchKeywords(responseJSON.searchKeywords)

        }catch(error){
        
            toast(error.message)
        
        }finally{
        
            setIsLoadingProductSearchKeywords(false)
        
        }
    }

  const initialize = async () => {

    const selectedSpecs = Cookies.get('ymm_specs') 
    
    if( selectedSpecs ){

        let selectedValues = Object.values(JSON.parse(selectedSpecs))
            .sort((spec1, spec2) => spec1.sortOrder - spec2.sortOrder)
            .map(spec => (`${spec.specKey}:${spec.selectedValue}`)).join('::')
        

        setSelectedSpecs(selectedValues)
        setSelectedSpecsLabels(selectedValues.split('::').map(a => a.split(':')[1]).join(' '))

    }

    fetchSearchKeywords()

  }


  useEffect(()=> {
    initialize()

  }, [])

  const handleChangeSelection = () => setSelectedSpecs('')
  
  return(
    <div style={{paddingTop:'20px', paddingBottom:'20px'}}>

      {
        isLoadingProductSearchKeywords 
          ? 
            <LoadingSpinner />
          : 
            <>
            {
                searchKeywords.trim().length > 0
                    ? (
                        <>
                            {
                                selectedSpecs.trim().length == 0 ? (
                                  <SpecsDropdownWidget 
                                    endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/dropdown-specs`}
                                    callbackToSubmission={callBack}
                                    storeHash={process.env.NEXT_PUBLIC_STORE_HASH}
                                    widgetProps={widgetProps}
                                  /> 
                                ): (
                                    <>
                                        {
                                           searchKeywords
                                           .split(',')
                                           .map(sk => sk.trim())
                                           .includes(selectedSpecs)
                                            ? (
                                                <Alert severity={'success'}>
                                                    <div>
                                                        This product fits your <strong>{selectedSpecsLabels}</strong>
                                                    </div>
                                                    <div onClick={handleChangeSelection} style={{textDecoration:'underline', cursor:'pointer'}}>
                                                        Change Selection
                                                    </div>
                                                </Alert>
                                            ) : (
                                                <Alert severity={'error'}>
                                                    <div>
                                                        This product does not fit your <strong>{selectedSpecsLabels}</strong>
                                                    </div>
                                                    <div onClick={handleChangeSelection} style={{textDecoration:'underline', cursor:'pointer' }}>
                                                        Change Selection
                                                    </div>
                                                </Alert>
                                            )
                                        }
                                    </>
                                )
                            }
                        </>
                    ): (
                        <Alert severity={'info'}>
                            This Product Lacks Fitment Data. Please verify fitment manually.
                        </Alert>
                    )
            }
          </>
      }
    </div>
  ) 
} 