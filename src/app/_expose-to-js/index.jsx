import { renderHomePageYmmWidget } from "./home_page_widget";

var page_type ='{{page_type}}' // this will be parsed by bigcommerce stencil to generate meaningful data
var categoryId = ''
var productId = ''
if(page_type == 'category'){
	categoryId = '{{category.id}}'
}else if(page_type == 'product'){
	productId = '{{product.id}}';
}


// Check if the div exists and run the widget rendering logic immediately
const container = document.getElementById("home_page_ymm_widget");

if (container) {
  renderHomePageYmmWidget();
} else {
  console.log("The widget div (#home_page_ymm_widget) does not exist.");
}

window.renderHomePageYmmWidget = renderHomePageYmmWidget;