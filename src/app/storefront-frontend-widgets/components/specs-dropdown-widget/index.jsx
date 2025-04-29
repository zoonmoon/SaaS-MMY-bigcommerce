import Button from '@mui/joy/Button';
import { useEffect, useState, useRef } from "react";
import {  FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

export function SpecsDropdownWidget({ endpoint, storeHash, callbackToSubmission, listingPage = false}){

    const [dropdownsAutoFetchCompleted, setDropdownsAutoFetchedCompleted] = useState(true)  
    // when user redirected to page B from Page A after submitting this form
    // we need to auto select the dropdown in Page B to show the default selected
    // this variable tracks if the autoselection action was performed 

    const [dropdownSpecs, setDropdownSpecs] = useState({})

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)

    const [isSubmitButtonLoading, setIsSubmitButtonLoading]= useState(false) 

    const [isDropdownSpecChangedByUserAction, setIsDropdownSpecChangedByUserAction] = useState(false)
    
    function returnSelectedInfo(specToFetch){
        
        let selectedInfo = [];
        
        // if the order is make engine year model
        // if we are fetching year, then only the make and engine should be used to fetch the year options
        // similary to fetch engine, we need to pass the value of only the make 
        // ie.e to fetch (n)th term, pass the vlaues from 1 to (n-1)th term
        Object.values(dropdownSpecs).filter(spec => spec.sortOrder < dropdownSpecs[specToFetch].sortOrder).forEach(spec => {
            if(spec.selectedValue != '')
                selectedInfo.push(`${spec.specKey}:${spec.selectedValue}`)     
        }) 

        return selectedInfo.join('::')

    }

    function returnQueryParamsString(specToFetch){
        
        const queryParams = []
        
        queryParams.push(`store_hash=${storeHash}`)
        queryParams.push(`selected_specs_info=${returnSelectedInfo(specToFetch)}`)
        queryParams.push(`spec_to_fetch=${specToFetch}`) // based on 
        queryParams.push(`is_listing_page=${listingPage}`) // based on 
        
        return queryParams.join('&')
        
    }

    const isFetchingRef = useRef(false); // need to leverage useRef instead of useState in this case 
    
    async function fetchDropdownSpecs(specToFetch = ''){

        if (isFetchingRef.current) return; // 🔒 Guard: fully reliable
        
        isFetchingRef.current = true;      // 🔒 Immediately locks further calls        

        try{

            let finalEndpoint = `${endpoint}?${returnQueryParamsString(specToFetch)}`
        
            const response  = await fetch(finalEndpoint) 

            const  dropdownSpecsFetchedData = await response.json() 

            setIsDropdownSpecChangedByUserAction(false) // allow to refetch data when user changes the dropdown state

            let dropdownSpecsExistingTemp = { ...dropdownSpecs };
            

            if(dropdownSpecsFetchedData.responseContainsValidSpecsSettings === true ){

                // dropdownSpecs is not yet set
                // because responseContainsValidSpecsSettings = true, which happens only in first request
                // so populate dropdownSpecs state first

                let specs = dropdownSpecsFetchedData.specsSettings

                const urlParams = new URLSearchParams(window.location.search);
                
                const fits = urlParams.get('ymm_specs');

                let initialSpecKeyVsValue = {}

                if(fits !== null ){
                    
                    setDropdownsAutoFetchedCompleted(false)

                    const initialSpecsValues = fits.split('::') 
                    // fits = spec1:value1::spec2:value2 
                    // ie year:2019::make:ford 
                    // should ge in sorted order

                    initialSpecsValues.forEach(spec => {
                        const [specKey, specValue] = spec.split(':')
                        initialSpecKeyVsValue[specKey]  = specValue
                    })

                }

                specs.forEach(spec => {


                    let {key: specKey,  label: specLabel, sort_order: sortOrder} = spec 

                    let selectedValue = ''

                    if (initialSpecKeyVsValue.hasOwnProperty(specKey)) {
                        selectedValue = initialSpecKeyVsValue[specKey];
                    }

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



            setDropdownSpecs(dropdownSpecsExistingTemp)

        }catch(error){

            console.error(error)

        }finally{

            isFetchingRef.current = false; // ✅ always unlock, even on error
            
        }

    }


    useEffect(() => {

        setIsSubmitButtonDisabled( isFetchingRef.current ||  Object.values(dropdownSpecs).some(spec => spec.selectedValue == '' || spec.options.length == 0 ))

        if(!dropdownsAutoFetchCompleted){

            // this listens for change in the dropdown specs
            // but action will be taken only once after dropdownSpecs if first changed. 
            // isLoading condition added to avoid multiple fetches of the same option 
            // because dropdownSpecs object spec also changes witin the fetchDropdownSpecs function 
            Object.values(dropdownSpecs).forEach(spec => {

                if(
                    spec.selectedValue != ''  &&
                    spec.options.length == 0 // && 
                    // spec.isLoading == false  && 
                    // Object.values(dropdownSpecs)
                    //     .filter(spec2 => spec2.sortOrder < dropdownSpecs[spec.specKey].sortOrder)
                    //         .every(spec3 => spec3.options.length > 0 ) // make sure every previous dropdown is has been fetched
                ){
                    // this was auto filled
                    // So, fetch this 
                    fetchDropdownSpecs(spec.specKey) 

                } 

            })

            if(Object.values(dropdownSpecs).every(spec => spec.selectedValue !== '' && spec.options.length > 0)){
                setDropdownsAutoFetchedCompleted(true) 
            }

        }


    }, [dropdownSpecs])


    useEffect(() => {
        
        // fetch dropdown info
        // when initilizaing i.e. dropdownspecs has 0 keys
        // or when the dropdownspecs changes because of user action and not because of setting after fetching value from server
        // when isDropdownSpecChangedByUserAction = false, do not refetch - cause this useEffect runs
        // even when isDropdownSpecChangedByUserAction is false

        if(Object.keys(dropdownSpecs).length === 0){

           fetchDropdownSpecs()

        }else if( isDropdownSpecChangedByUserAction ){
            
            // find the spec with minimum sort order and selectedValue = ''

            const specsEmptySelectedValue = Object.values(dropdownSpecs)
                .filter(spec => spec.selectedValue === '')  // Only include specs where selectedValue is ''
                
            if(specsEmptySelectedValue.length > 0){

                const specWithMinSortOrderAndEmptySelectedValue = specsEmptySelectedValue            
                    .reduce((spec1, spec2) => spec2.sortOrder < spec1.sortOrder ? spec2 : spec1)
                
                var specToFetch =  specWithMinSortOrderAndEmptySelectedValue.specKey;

                fetchDropdownSpecs(specToFetch)

            }else{

                // all dropdowns have been selected
                // so redirect to the correct listing page

                setIsDropdownSpecChangedByUserAction(false) 
                // this variable was reset only after fetching new data
                // since we are not fetching new data this time, we need to reset this variable here
                // so that further changes are triggered and listened to 

            }

        }
        
    }, [isDropdownSpecChangedByUserAction])    

    const handleDropdownChange = ( newValue, specKey) => {

        if(newValue == null || newValue == '' ) return // avoid re-fetch when user clicks X icon inside autocomplete text field

        let dropdownSpecsExistingTemp = { ...dropdownSpecs };

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

        setIsDropdownSpecChangedByUserAction(true) 

    }

    const handleSubmission = () => {
        setIsSubmitButtonLoading(true)
        console.log(Object.values(dropdownSpecs))
        callbackToSubmission(Object.values(dropdownSpecs).map(spec => (`${spec.specKey}:${spec.selectedValue}`)).join('::'))
    }

    return(
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
            <Button loading={isSubmitButtonLoading} sx={{minWidth:'150px'}} variant={'solid'} disabled={isSubmitButtonDisabled } onClick={handleSubmission}>Search</Button>
        </div>
    )
}