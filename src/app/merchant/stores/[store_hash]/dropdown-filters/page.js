'use client'
import { Alert, Breadcrumbs, Container, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { use } from 'react'
import toast from "react-hot-toast"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import DragAndDrop from "."
import { LoadingSpinner } from "@/app/api/_lib/misc/utils"
import { Button } from "@mui/joy"


export default function StoreDetails({params}){

    const { store_hash } = use(params)

    const [isLoading, setIsLoading] = useState(true) 

    const [storeData, setStoreData] = useState({})

    const [spreadsheetColumns, setSpreadsheetColumns] = useState([])

    const [columnContainingProductIDs, setColumnContainingProductIDs] = useState('')  
    const [selectedDropdownFilters, setSelectedDropdownFilters] = useState([]) 

    const [isSaving, setIsSaving] = useState(false )

    async function fetchStore(){

        try{    

            const response   = await fetch(`/api/merchant/stores/${store_hash}/dropdown-filters`)

            const responseJSON = await response.json() 
            
            if(!responseJSON.success) throw new Error(responseJSON.message)
            
            setStoreData(responseJSON.storeData)

            const productColumn = responseJSON.storeData?.columnContainingProductIDs;
            const allColumns = responseJSON.allSpreadSheetColumns || [];
            
            setSpreadsheetColumns(allColumns);
            
            if (allColumns.includes(productColumn)) {
              setColumnContainingProductIDs(productColumn);
            } else {
              setColumnContainingProductIDs('');
            }
            
            const dropdownFilters = responseJSON.storeData.selectedDropdownFilters || [];

            setSelectedDropdownFilters(dropdownFilters.map(df => df.label))

        }catch(error){
            
            toast(error.message)
            
        }finally{

            setIsLoading(false)
        
        }
        
    }


    useEffect(()=> {
        fetchStore()
    }, [])

    const handleDropdownFiltersSubmit =  async () => {

        try{
            setIsSaving(true) 

            const formdata = new FormData()
            
            formdata.append('columnContainingProductIDs', columnContainingProductIDs) 
            formdata.append('selectedDropdownFilters', JSON.stringify(selectedDropdownFilters)) 
            formdata.append('doc_id', storeData.id) 
            
            const response   = await fetch(`/api/merchant/stores/${store_hash}/dropdown-filters`, {method:'POST', body: formdata})

            const responseJSON = await response.json() 

            if(responseJSON.success !== true) throw new Error(responseJSON.message) 
            
            toast("Changes saved")

        }catch(error){ 
            toast(error.message)
        }finally{
            setIsSaving(false)
        }

    }

    const handleSelectedFiltersChange = (newSelectedFilters) => {
        setSelectedDropdownFilters(newSelectedFilters) 
        console.log("newSelectedFilters", newSelectedFilters)
    }   

    return(
        <Container sx={{marginTop:'20px'}} maxWidth={'lg'}>
            {
                isLoading 
                    ? (
                        <LoadingSpinner minHeight="200px" />
                    ): (    
                       <Paper sx={{padding:'15px'}}>
                            <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-between'}}> 
                                <div style={{display:'flex', gap: '10px', alignItems:'center'}}>
                                    <IconButton onClick={() => history.back()} aria-label="add an alarm">
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <Breadcrumbs aria-label="breadcrumb">
                                        <Link underline="hover" style={{color:'unset'}} href="/merchant/stores">
                                            stores
                                        </Link>
                                        <Link underline="hover" style={{color:'unset'}} href={"/merchant/stores/"+storeData.store_hash}>
                                            {storeData.store_name}
                                        </Link>
                                        <Typography sx={{ color: 'text.primary' }}>Dropdown Filters</Typography>
                                    </Breadcrumbs>
                                </div>
                                <div><Button loading={isSaving} onClick={handleDropdownFiltersSubmit} variant={'solid'}>Save Changes</Button></div>
                            </div>
                            <Divider sx={{margin:'10px 0 25px 0'}}></Divider>

                            <Stack spacing={2} >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Column containing Product IDs</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Column containing Product IDs"
                                        onChange={(e) => setColumnContainingProductIDs(e.target.value)}
                                        value={columnContainingProductIDs}
                                    >
                                        {
                                            spreadsheetColumns.map((col, index) => {
                                                return(
                                                    <MenuItem value={col} key={col} >{col}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                
                                <Divider />
                                    
                                <Alert severity={'info'}>
                                    The items can be moved from "Available" section to "Selected" section and vice verca. The selected filters, which can be sorted as needed, are displayed in website.
                                </Alert>
                                
                                <DragAndDrop
                                    columnContainingProductIDs={columnContainingProductIDs}
                                    allItems={spreadsheetColumns}
                                    initialRightItems={selectedDropdownFilters}
                                    handleSelectedFiltersChange={handleSelectedFiltersChange}
                                />

                            </Stack>

                       </Paper>
                    )
            }
        </Container>
    )
}