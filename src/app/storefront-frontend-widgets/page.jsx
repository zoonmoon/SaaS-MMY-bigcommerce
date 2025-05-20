'use client'

import { SpecsDropdownWidget } from "./components/specs-dropdown-widget";

function HomePageSpecsDropdownWidget({widgetProps = {}}
){
  
  const callBack = (selectedSpecs) => {
    window.location.href = `/search.php?search_query="${selectedSpecs}"&ymm_specs=${selectedSpecs}`;  //
  };
  
  return(
    <div style={{paddingTop:'20px', paddingBottom:'20px'}}>
      <SpecsDropdownWidget 
        endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/dropdown-specs`}
        callbackToSubmission={callBack}
        widgetProps={widgetProps}
      /> 
    </div>
  ) 
}

export default HomePageSpecsDropdownWidget;