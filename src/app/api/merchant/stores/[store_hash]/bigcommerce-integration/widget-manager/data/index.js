export function returnTemplate(id, classes = '', title = '',  submitButtonText='', submitButtonColor='', headingFontSize=''){
    // if(headingFontSize.trim().length == 0 ) headingFontSize = '16'
    
    // if(submitButtonColor.trim().length == 0) submitButtonColor = '#000000'

    // if(title.trim().length == 0 ) title = "Select your Spa" 

    // if(submitButtonText.trim().length == 0 )submitButtonText = "Go"

    // if(classes.trim().length == 0) classes = 'container'
    
    return `<div    
            class="widget-info-div-zoon${classes.trim().length > 0 ? ' '+classes: ''}" 
            data-title="${title}" 
            data-classes="${classes}"
            data-submit-button-text="${submitButtonText}"
            data-submit-button-bg-color="${submitButtonColor}"  
            data-heading-font-size="${headingFontSize}"  
        >
            <div id="${id}-container" style="min-height: 30px">
                <div id='${id}'></div>
            </div>
        </div>`;
}

export const widgetsThatShouldBeCreated = [
    {
        name: "YMM Home Page Widget",
        id: "ymm-home-page-widget",
        template: returnTemplate('ymm-home-page-widget')
    },
    {
        name: "YMM Search Page Widget",
        id: "ymm-search-page-widget",
        template: returnTemplate('ymm-search-page-widget')
    },
    {
        name: "YMM Product Page Widget",
        id: "ymm-product-page-widget",
        template: returnTemplate('ymm-product-page-widget')
    }
]