import { renderHomePageYmmWidget } from "./home_page_widget"
import { renderSearchPageYmmWidget } from "./search_page_widget"
import { renderProductPageYmmWidget } from "./product_page_widget";
    
if(window.store_hash){
    renderHomePageYmmWidget();
    renderSearchPageYmmWidget();
    renderProductPageYmmWidget();
}