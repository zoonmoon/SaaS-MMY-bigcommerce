
import ReactDOM from "react-dom/client";
import SpecsDropdownWidgetSearchPage from "../storefront-frontend-widgets/search_page/page";
import { returnWidgetProps } from "./utils";
// Replace this function name if needed
export function renderSearchPageYmmWidget() {

    const container = document.getElementById("ymm-search-page-widget");
    
    if (!container) return;
    const widgetProps = returnWidgetProps("ymm-search-page-widget")
    
    const root = ReactDOM.createRoot(container);
    
    root.render(
        <SpecsDropdownWidgetSearchPage  widgetProps={widgetProps}/>
    );

}