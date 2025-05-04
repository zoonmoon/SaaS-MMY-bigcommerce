import ReactDOM from "react-dom/client";
import HomePageSpecsDropdownWidget from "../storefront-frontend-widgets/page";

// Replace this function name if needed
export function renderHomePageYmmWidget() {
    const container = document.getElementById("ymm-home-page-widget");
    if (!container) return;
    
    const root = ReactDOM.createRoot(container);
    
    root.render(
      <HomePageSpecsDropdownWidget />
    );
}