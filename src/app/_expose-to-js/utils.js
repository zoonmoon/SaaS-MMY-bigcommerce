export function returnWidgetProps(elemID){
    const divWithWidgetAttribs = document.getElementById(elemID).closest('.widget-info-div-zoon') 
    const firstDiv = divWithWidgetAttribs
    const classes = firstDiv ? firstDiv.getAttribute('data-classes') : '';
    const widgetHeading = firstDiv ? firstDiv.getAttribute('data-title') : '';
    const submitButtonText = firstDiv ? firstDiv.getAttribute('data-submit-button-text') : '';
    const submitButtonBackgroundColor = firstDiv ? firstDiv.getAttribute('data-submit-button-bg-color') : '';
    let headingFontSize = firstDiv ? firstDiv.getAttribute('data-heading-font-size') : '';
    if( headingFontSize.trim().length == 0 ) headingFontSize = 16
    if(submitButtonBackgroundColor.trim().length == 0 ) submitButtonBackgroundColor = '#000000'
    if(submitButtonText.trim().length == 0) submitButtonText = 'Go'
    return {classes, widgetHeading, submitButtonText, submitButtonBackgroundColor, headingFontSize}
}