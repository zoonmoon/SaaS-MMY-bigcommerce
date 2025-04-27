
import React from "react";
import ReactDOM from "react-dom/client";
import { SpecsDropdownWidget } from "../storefront-frontend-widgets/components/specs-dropdown-widget";


// Replace this function name if needed
export function renderHomePageYmmWidget() {
    const container = document.getElementById("home_page_ymm_widget");
    if (!container) return;
  
    // Callback function
    const callBackForHomePageWidget = (selectedSpecs) => {
      window.location.href = `/search.php?search_query="${selectedSpecs}"&ymm_specs=${selectedSpecs}`;  // Redirects to the search page with the selected specs
    };
    
    const root = ReactDOM.createRoot(container);
    root.render(
      <SpecsDropdownWidget
        endpoint={`${process.env.NEXT_PUBLIC_API_URL}/api/storefront/dropdown-specs`}
        callbackToSubmission={callBackForHomePageWidget}
        storeHash={process.env.NEXT_PUBLIC_STORE_HASH}
      />
    );
}