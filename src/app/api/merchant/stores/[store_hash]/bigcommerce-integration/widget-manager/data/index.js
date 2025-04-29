function returnTemplate(id){
    return `<div id='${id}' style="min-height: 30px"></div>`;
}

export const widgetsThatShouldBeCreated = [
    {
        name: "YMM Home Page Widget",
        template: returnTemplate('ymm-home-page-widget')
    },
    {
        name: "YMM Search Page Widget",
        template: returnTemplate('ymm-search-page-widget')
    }
]