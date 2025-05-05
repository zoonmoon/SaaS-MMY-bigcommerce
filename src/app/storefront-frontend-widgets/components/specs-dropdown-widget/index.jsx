import Button from '@mui/joy/Button';
import { useEffect, useState, useRef } from "react";
import {  FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Cookies from 'js-cookie';

export function SpecsDropdownWidget(
    { 
        endpoint, 
        storeHash, 
        callbackToSubmission, 
        listingPage = false, 
        widgetProps
    }
){
    const {
        classes = '',
        widgetHeading = '',
        submitButtonText = 'Go',
        submitButtonBackgroundColor = '#000000',
        headingFontSize = '14'
      } = widgetProps;
    

    const [dropdownsAutoFetchCompleted, setDropdownsAutoFetchedCompleted] = useState(true)  
    // when user redirected to page B from Page A after submitting this form
    // we need to auto select the dropdown in Page B to show the default selected
    // this variable tracks if the autoselection action was performed 

    const [dropdownSpecs, setDropdownSpecs] = useState({})

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)

    const [isSubmitButtonLoading, setIsSubmitButtonLoading]= useState(false) 
    
    const returnYMMspecsFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search); 
        let fits = urlParams.get('ymm_specs');
        return fits
    }

    function returnSelectedInfo(specToFetch, presentState){
        
        let selectedInfo = [];
        
        let presentStateTemp  = {...presentState}

        console.log("presentStateTemp",  presentStateTemp)
        // if the order is make engine year model
        // if we are fetching year, then only the make and engine should be used to fetch the year options
        // similary to fetch engine, we need to pass the value of only the make 
        // ie.e to fetch (n)th term, pass the vlaues from 1 to (n-1)th term
        Object.values(presentStateTemp).filter(spec => spec.sortOrder < presentStateTemp[specToFetch].sortOrder).forEach(spec => {
            if(spec.selectedValue != '')
                selectedInfo.push(`${spec.specKey}:${spec.selectedValue}`)     
        }) 

        return selectedInfo.join('::')

    }

    function returnQueryParamsString(specToFetch, presentState){
        
        const queryParams = []
        
        queryParams.push(`store_hash=${storeHash}`)
        queryParams.push(`selected_specs_info=${returnSelectedInfo(specToFetch, presentState)}`)
        queryParams.push(`spec_to_fetch=${specToFetch}`) // based on 
        queryParams.push(`is_listing_page=${listingPage}`) // based on 
        
        return queryParams.join('&')
        
    }

    const isFetchingRef = useRef(false); // need to leverage useRef instead of useState in this case 
    
    function processFetchedData(dropdownSpecsExistingTemp, dropdownSpecsFetchedData){

        if(dropdownSpecsFetchedData.responseContainsValidSpecsSettings === true ){

            // dropdownSpecs is not yet set
            // because responseContainsValidSpecsSettings = true, which happens only in first request
            // so populate dropdownSpecs state first

            let specs = dropdownSpecsFetchedData.specsSettings

            specs.forEach(spec => {

                let {key: specKey,  label: specLabel, sort_order: sortOrder} = spec 

                let selectedValue = ''

                // if (initialSpecKeyVsValue.hasOwnProperty(specKey)) {
                //     selectedValue = initialSpecKeyVsValue[specKey];
                // }

                dropdownSpecsExistingTemp[specKey] = {
                    specKey, 
                    specLabel,  
                    sortOrder, // the order in which the dropdowns are displayed, starts from 1
                    selectedValue, // dropdown selected value
                    options: [], // dropdown options 
                    isLoading: false // true only when loading entries for this spec 
                }

            })

        }

        if(dropdownSpecsExistingTemp.hasOwnProperty(dropdownSpecsFetchedData.dropdownData.spec)){
            dropdownSpecsExistingTemp[dropdownSpecsFetchedData.dropdownData.spec].options = dropdownSpecsFetchedData.dropdownData.entries
            dropdownSpecsExistingTemp[dropdownSpecsFetchedData.dropdownData.spec].isLoading = false // as it has been just loaded
        }

        return dropdownSpecsExistingTemp

    }

    async function fetchDropdownSpecs(dropdownSpecsExistingTemp = {}, specToFetch = ''){
        
        let dropdownSpecsExistingTemp2 = {...dropdownSpecsExistingTemp}
        
        if (isFetchingRef.current) return; // 🔒 Guard: fully reliable
        
        isFetchingRef.current = true;      // 🔒 Immediately locks further calls        

        try{

            let finalEndpoint = `${endpoint}?${returnQueryParamsString(specToFetch, dropdownSpecsExistingTemp2)}`
        
            const response  = await fetch(finalEndpoint) 

            const  dropdownSpecsFetchedData = await response.json() 
            
            const newState = processFetchedData(dropdownSpecsExistingTemp2, dropdownSpecsFetchedData) 

            return newState

        }catch(error){

            console.error(error)

        }finally{

            isFetchingRef.current = false; // ✅ always unlock, even on error
            
        }

    }

    async function initialize(){
        
        if(isDropdownSpecsSetFromCookie()) return 

        let presentState = await fetchDropdownSpecs() 
        // this state consists only the starting years

        let fits = returnYMMspecsFromURL()

        if(fits == null ){
            setDropdownSpecs(presentState) 
            return 
        } 

        fits = fits.replaceAll('"', '')
        
        let splittedFits  = fits.split('::') 

        for(var i =0 ;i<splittedFits.length; i++ ){
            
            let [specKey, specValue] = splittedFits[i].split(':') 
            
            let newState = await processDropdownChanges(specValue, specKey, presentState) 
            
            if(newState !== false )
                presentState = newState
            
        }

        setDropdownSpecs(presentState) 

    }

    useEffect(() => {
        setIsSubmitButtonDisabled( 
            isFetchingRef.current ||   
            Object.values(dropdownSpecs).some(spec => spec.selectedValue == '' || spec.options.length == 0 ) || 
            Object.values(dropdownSpecs).length == 0 
        )
    }, [dropdownSpecs])

    useEffect(()=>{
        initialize()
    }, [])

    const processDropdownChanges = async (newValue, specKey, presentState) => {

        let dropdownSpecsExistingTemp = {...presentState}

        if(newValue != null )
            dropdownSpecsExistingTemp[specKey].selectedValue = newValue
        else
            dropdownSpecsExistingTemp[specKey].selectedValue = ''

        var itsSortOrder  = dropdownSpecsExistingTemp[specKey].sortOrder

        // Loop through all specs and reset values and options for those whose sortOrder > this spec's sortOrder

        Object.entries(dropdownSpecsExistingTemp).forEach(([key, spec]) => {
            if (spec.sortOrder > itsSortOrder) {
                spec.selectedValue = '';  // Reset selected value
                spec.options = [];  // Reset options
                spec.isLoading = false;  // Optional: Reset loading state
            }

            if(spec.sortOrder === itsSortOrder + 1)
                spec.isLoading = true 

        });
        
        setDropdownSpecs(dropdownSpecsExistingTemp)

        const specsEmptySelectedValue = Object.values(dropdownSpecsExistingTemp)
        .filter(spec => spec.selectedValue === '')  // Only include specs where selectedValue is ''
        
        if(specsEmptySelectedValue.length > 0){

            const specWithMinSortOrderAndEmptySelectedValue = specsEmptySelectedValue            
                .reduce((spec1, spec2) => spec2.sortOrder < spec1.sortOrder ? spec2 : spec1)
            
            var specToFetch =  specWithMinSortOrderAndEmptySelectedValue.specKey;

            let newState = await  fetchDropdownSpecs(dropdownSpecsExistingTemp, specToFetch)

            return newState

        }

        return false 

    }

    const handleDropdownChange = async ( newValue, specKey) => {

        if(newValue == null || newValue == '' ) return // avoid re-fetch when user clicks X icon inside autocomplete text field

        let dropdownSpecsExistingTemp = { ...dropdownSpecs };

        const newState = await processDropdownChanges(newValue, specKey, dropdownSpecsExistingTemp)

        if(newState !== false )
            setDropdownSpecs(newState)

    }

    const handleSubmission = () => {        
        setIsSubmitButtonLoading(true)
        let selectedValues = Object.values(dropdownSpecs)
            .sort((spec1, spec2) => spec1.sortOrder - spec2.sortOrder)
            .map(spec => (`${spec.specKey}:${spec.selectedValue}`)).join('::')
        Cookies.set('ymm_specs', JSON.stringify(dropdownSpecs), { expires: 7 });
        callbackToSubmission(selectedValues)
    }

    const isDropdownSpecsSetFromCookie = () => {

        let fits = returnYMMspecsFromURL()
        const selectedSpecs = Cookies.get('ymm_specs') 
        if(fits == null &&  selectedSpecs) {
            setDropdownSpecs(JSON.parse(selectedSpecs))
            return true 
        }  


        if(fits != null && selectedSpecs ){
        
            fits = fits.replaceAll('"', '')
            
            let selectedValues = Object.values(JSON.parse(selectedSpecs))
                .sort((spec1, spec2) => spec1.sortOrder - spec2.sortOrder)
                .map(spec => (`${spec.specKey}:${spec.selectedValue}`)).join('::')

            if(fits.replaceAll('"', '') == selectedValues ){
                setDropdownSpecs(JSON.parse(selectedSpecs))
                return true 
            }

        }
        
        return false 

    }


    return(
        <div className={classes}>
            {
                widgetHeading.trim().length > 0 && (
                    <div style={{fontSize:headingFontSize+'px'}}>
                        {widgetHeading}
                    </div>
                )
            }
            <div 
                className="dropdowns-container"
                style={{
                    display:'flex',
                    flexWrap:'wrap',
                    gap: '10px'
                }}
            >
                {
                    Object.values(dropdownSpecs)
                    
                    .sort((spec1, spec2) => spec1.sortOrder - spec2.sortOrder)

                    .map(({specKey, specLabel,selectedValue,options,isLoading}, index) => {

                        // if(isLoading){
                        //     return(
                        //         <div key={index}>
                        //             Loading
                        //         </div>
                        //     )
                        // }
                        
                        if(options.length == 0) selectedValue = ''

                        // Check if all items satisfy the condition
                        const allValid = options.every(option => !isNaN(option.value) && option.value !== null && option.value !== undefined);

                        // If all values are valid, sort and replace the original options
                        if (allValid) {
                            const sortedOptions = options
                                .map(option => ({
                                    ...option,
                                    value: Number(option.value)  // Convert value to number for sorting
                                }))
                                .sort((a, b) => b.value - a.value);

                            // Replace the original options
                            options.length = 0; // Clear the original options array
                            options.push(...sortedOptions); // Add the sorted options back to the original array
                        }

                        return(
                            <FormControl  key={index} sx={{flexGrow:1, minWidth:'200px'}}>
                                <InputLabel>{isLoading ? 'Loading': specLabel}</InputLabel>
                                <Select
                                    onChange={(event) => handleDropdownChange(event.target.value, specKey)}
                                    label={isLoading ? 'Loading' : specLabel}
                                    disabled={options.length == 0}
                                    value={selectedValue}
                                >
                                    {
                                        options.map(({value, label}, index) => <MenuItem key={index} value={value}>{label}</MenuItem> )
                                    }
                                </Select>
                            </FormControl>
                        )
                    })
                }
                <Button loading={isSubmitButtonLoading} sx={{minWidth:'150px', backgroundColor:submitButtonBackgroundColor}} variant={'solid'} disabled={isSubmitButtonDisabled } onClick={handleSubmission}>{submitButtonText}</Button>
            </div>
        </div>

    )
}