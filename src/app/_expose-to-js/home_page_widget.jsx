import ReactDOM from "react-dom/client";
import HomePageSpecsDropdownWidget from "../storefront-frontend-widgets/page";
import { returnWidgetProps } from "./utils";
// Replace this function name if needed
export function renderHomePageYmmWidget() {
    const container = document.getElementById("ymm-home-page-widget");
    if (!container) return;
    
    const widgetProps = returnWidgetProps("ymm-home-page-widget")

    const root = ReactDOM.createRoot(container);
    
    root.render(
      <HomePageSpecsDropdownWidget 
        widgetProps={widgetProps}
      />
    );
}