export function returnWidgetProps(elemID){
    const divWithWidgetAttribs = document.getElementById(elemID).closest('.widget-info-div-zoon') 
    const firstDiv = divWithWidgetAttribs
    const classes = firstDiv ? firstDiv.getAttribute('data-classes') : '';
    const widgetHeading = firstDiv ? firstDiv.getAttribute('data-title') : '';
    let submitButtonText = firstDiv ? firstDiv.getAttribute('data-submit-button-text') : '';
    let submitButtonBackgroundColor = firstDiv ? firstDiv.getAttribute('data-submit-button-bg-color') : '';
    let headingFontSize = firstDiv ? firstDiv.getAttribute('data-heading-font-size') : '';
    if( headingFontSize.trim().length == 0 ) headingFontSize = 16
    if(submitButtonBackgroundColor.trim().length == 0 ) submitButtonBackgroundColor = '#000000'
    if(submitButtonText.trim().length == 0) submitButtonText = 'Go'
    let store_hash = false
    if(window.store_hash) store_hash = window.store_hash
    return {classes, store_hash, widgetHeading, submitButtonText, submitButtonBackgroundColor, headingFontSize}
}