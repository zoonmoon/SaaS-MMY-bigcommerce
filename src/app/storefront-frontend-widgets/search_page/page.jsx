'use client'

import { useEffect, useState } from "react";
import { SpecsDropdownWidget } from "../components/specs-dropdown-widget";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { LoadingSpinner } from "../components/loading-spinner";

export default function SpecsDropdownWidgetSearchPage({widgetProps = {}}){

  const { headingFontSize = '14', store_hash = process.env.NEXT_PUBLIC_STORE_HASH} = widgetProps;
  
  const [selectedSpecsDetailedInfo, setSelectedSpecsDetailedInfo] = useState('')

  const callBack = (selectedSpecs) => {
    
    const currentPage = window.page_type 
    
    if(currentPage == 'category'){
      const url = window.location.pathname;
      const basePath = url.split('/').slice(0, 3).join('/');
      console.log(basePath); /*  /sundance-spas/  */
      window.location.href = `${basePath}?q="${selectedSpecs}"&ymm_specs=${selectedSpecs}`;  //
    }else{
      window.location.href = `/search.php?search_query="${selectedSpecs}"&ymm_specs=${selectedSpecs}`;  //
    }

  };

  const [isDropdownWidgetsOpen, setIsDropdownWidgetsOpen] = useState(false) 

  const [isLoadingHashVsDetails, setIsLoadingHashVsDetails] = useState(true) 

  async function fetchDetailedInfo(hash){
    
    setIsLoadingHashVsDetails(true)

    try{
      
      let queryparams = []
      queryparams.push(`store_hash=${store_hash}`)
      queryparams.push(`hash=${hash}`) 
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
      setIsDropdownWidgetsOpen(true) 
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
              .map( spec => {
                console.log("spec.selectedValue", spec.selectedValue) 
                console.log("spec.options", spec.options) 
                
                let filtered =   spec.options.filter(option => option.value == spec.selectedValue )
                console.log(filtered) 
                if(filtered.length > 0){
                  return filtered[0].label 
                } 
                return ''
              })
              .join(' ')

              setIsLoadingHashVsDetails(false)
              // console.log("selectedValues hello", selectedValues)
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
    <div style={{paddingTop:'20px', paddingBottom:'20px'}}>
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
                    widgetProps={widgetProps}
                  /> 
                ): (
                  <div style={{display:'flex', alignItems:'center', gap:'20px', flexWrap:'wrap'}}>
                    <div className="selected-specs" style={{fontSize:headingFontSize+'px'}}>
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