'use client'

import { useEffect, useState } from "react";
import { SpecsDropdownWidget } from "../components/specs-dropdown-widget";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { LoadingSpinner } from "../components/loading-spinner";

export default function SpecsDropdownWidgetSearchPage({widgetProps = {}}){

  const [selectedSpecsDetailedInfo, setSelectedSpecsDetailedInfo] = useState('')

  const callBack = (selectedSpecs) => {
    window.location.href = `/search.php?search_query="${selectedSpecs}"&ymm_specs=${selectedSpecs}`;  //
  };

  const [isDropdownWidgetsOpen, setIsDropdownWidgetsOpen] = useState(false) 

  const [isLoadingHashVsDetails, setIsLoadingHashVsDetails] = useState(true) 

  async function fetchDetailedInfo(hash){
    
    setIsLoadingHashVsDetails(true)

    try{

      let queryparams = []
      queryparams.push(`store_hash=${storeHash}`)
      queryparams.push(`hash=${hash}`) 
      queryparams.join('&')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/specs-hash-vs-details?${queryparams.join('&')}`)
      
      const responseJSON = await response.json()

      if(responseJSON.success !== true) throw new Error(responseJSON.message) 

      setSelectedSpecsDetailedInfo(responseJSON.selectedSpecsLabels)

    }catch(error){
    
      toast(error.message)
    
    }finally{
    
      setIsLoadingHashVsDetails(false)
    
    }
  
  }

  const initialize = () => {

    const urlParams = new URLSearchParams(window.location.search); 
    
    let fits = urlParams.get('ymm_specs');
    
    if(fits == null ){
      setIsLoadingHashVsDetails(false)
      isDropdownWidgetsOpen(true) 
      return 
    }

    const selectedSpecs = Cookies.get('ymm_specs') 

    if( selectedSpecs ){

        let selectedValuesHash = Object.values(JSON.parse(selectedSpecs))
            .sort( (spec1, spec2 ) => spec1.sortOrder - spec2.sortOrder )
            .map( spec => `${spec.specKey}:${spec.selectedValue}` )
            .join('::')
        
        if(fits.replaceAll('"', '') == selectedValuesHash ){

            console.log(selectedSpecs)

            let selectedValues = Object.values(JSON.parse(selectedSpecs))
              .sort( (spec1, spec2 ) => spec1.sortOrder - spec2.sortOrder )
              .map( spec => spec.options.filter(option => option.value === spec.selectedValue )[0].label )
              .join(' ')

              setIsLoadingHashVsDetails(false)
              console.log("selectedValues hello", selectedValues)
              setSelectedSpecsDetailedInfo(selectedValues)
        }else{
          fetchDetailedInfo(fits.replaceAll('"', ''))
        }
        
    }
        
  }

  useEffect(()=> {
    initialize()

  }, [])

  const handleDropdownWidgetViewToggle = () => setIsDropdownWidgetsOpen(!isDropdownWidgetsOpen)

  return(
    <div
      style={{marginTop:'20px'}}
    >
      {
        isLoadingHashVsDetails 
          ? 
            <LoadingSpinner />
          : (
            <>
              {
                isDropdownWidgetsOpen ? (
                  <SpecsDropdownWidget 
                    endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/dropdown-specs`}
                    callbackToSubmission={callBack}
                    storeHash={process.env.NEXT_PUBLIC_STORE_HASH}
                    widgetProps={widgetProps}
                  /> 
                ): (
                  <div style={{display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
                    <div className="selected-specs">
                      {selectedSpecsDetailedInfo}
                    </div>
                    <a className="change-link" style={{color:'unset'}} onClick={handleDropdownWidgetViewToggle} href='#'>Change Selection</a>
                  </div>
                )
              }
            </>
          )
      }
    </div>
  ) 
} 