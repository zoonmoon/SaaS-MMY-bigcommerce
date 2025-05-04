'use client'

import { SpecsDropdownWidget } from "./components/specs-dropdown-widget";

function HomePageSpecsDropdownWidget(){
  
  const callBack = (selectedSpecs) => {
    window.location.href = '/search.php?ymm_specs="'+selectedSpecs+'"';  //
  };
  
  console.log("ENV URL from componenet:", process.env.NEXT_PUBLIC_API_URL);
  
  return(
    <div
      style={{marginTop:'20px'}}
    >
      <SpecsDropdownWidget 
        endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/dropdown-specs`}
        callbackToSubmission={callBack}
        storeHash={process.env.NEXT_PUBLIC_STORE_HASH}
      /> 
    </div>
  ) 
}

export default HomePageSpecsDropdownWidget;