

import ReactDOM from "react-dom/client";
import { returnWidgetProps } from "./utils";
// Replace this function name if needed
import SpecsDropdownWidgetProductPage from "../storefront-frontend-widgets/product_page/page";

export function renderProductPageYmmWidget() {

    console.log("rendering pdp widget")
    
    const container = document.getElementById("ymm-product-page-widget");
    
    if (!container) return;
    const widgetProps = returnWidgetProps("ymm-product-page-widget")
    
    console.log("after return")
    const root = ReactDOM.createRoot(container);
    
    root.render(
        <SpecsDropdownWidgetProductPage  widgetProps={widgetProps}/>
    );

}