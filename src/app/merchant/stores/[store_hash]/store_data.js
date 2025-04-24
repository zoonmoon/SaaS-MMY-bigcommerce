import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Padding } from '@mui/icons-material';
import { Alert, Breadcrumbs, Button, Chip, Divider, InputLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';

const FitmentDataSource = ({storeData}) => {
    let spreadsheet_url = ''
    if ('spreadsheet_url' in storeData) {
        spreadsheet_url = storeData.spreadsheet_url
    }
    if(spreadsheet_url == undefined || spreadsheet_url == null){
        spreadsheet_url = ''
    }


    const [isLoading, setIsLoading ] = React.useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
            
        try{
            
            setIsLoading(true)

            const response  = await fetch('/api/merchant/stores/'+storeData.store_hash+'/update-google-sheet-url', { method: 'POST', body: formData });

            const responseJSON = await response.json() 

            if(responseJSON.success == false ) throw new Error(responseJSON.message)
            
            toast(responseJSON.message)

            if(responseJSON.success == true){
                window.location.href = '/merchant/stores/'+storeData.store_hash
            }
            
        }catch(error){
            toast(error.message)
        }finally{
            setIsLoading(false)
        }

    };

    return(
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {
                spreadsheet_url.trim().length == 0 && (
                    <Alert  severity={'info'}>
                        Please enter the google sheet URL.
                        Grant view access to everyone having a link.
                    </Alert>
                )
            }
            <input type="hidden" name="doc_id" value={storeData.id} />
            <TextField label="Google Sheet URL" name="spreadsheet_url" value={storeData.spreadsheet_url}   fullWidth />
            <Button sx={{maxWidth:'200px'}} loading={isLoading} type="submit" variant="contained" >Save</Button>
        </Box>
    )

}

const tabData = (storeData) => {
    return  [
        {
            label: "General",
            tabContent: <GeneralInfo storeData={storeData} />
        },

        {
            label: "Fitment Data",
            tabContent: <FitmentDataSource storeData={storeData} />
        },

        {
            label: "Dropdown Filters",
            tabContent: <DropdownFilters storeData={storeData} />
        },
        {
            label: "BigCommerce Integration",
            tabContent: <div>BigCommerce Integration</div>
        },
        

    ]
}

const DropdownFilters = ({storeData}) => {

    let spreadsheet_url = ''
    if ('spreadsheet_url' in storeData) {
        spreadsheet_url = storeData.spreadsheet_url
    }
    if(spreadsheet_url == undefined || spreadsheet_url == null){
        spreadsheet_url = ''
    }


    let specs = []
    if ('selectedDropdownFilters' in storeData) {
        specs = storeData.selectedDropdownFilters
    }
    if(specs == undefined || specs == null){
        specs = []
    }



    const productColumn = storeData.columnContainingProductIDs || '';
    
    const dropdownFilters = storeData.selectedDropdownFilters || [];


    return(
        <>
            {
                spreadsheet_url == ''
                    ? (
                        <Alert severity={'warning'}>
                            Google Sheet URL has not been added.
                        </Alert>
                    ): (
                        specs.length == 0
                            ? (
                                <Stack spacing={2}>
                                    <Alert severity={'warning'}>
                                        Not any dropdown filter has been added.
                                    </Alert>
                                    <Link href={'/merchant/stores/'+storeData.store_hash+'/dropdown-filters'}>
                                        <Button sx={{maxWidth:'300px'}} variant={'contained'}>Add Dropdown Filters</Button>
                                    </Link>
                                </Stack>
                            ): (
                                <Stack spacing={2}>
                                    <div>
                                        <strong>Column containing Product ID</strong>: <span>{productColumn}</span>
                                    </div>
                                    <Stack spacing={1}>
                                        <div><strong>Dropdown Filters</strong></div>
                                        <div>
                                            {dropdownFilters.map((df, index) => {
                                                return(
                                                    <Chip style={{marginRight: '10px'}} variant="outlined" label={df.label} key={index} />
                                                )
                                            })}
                                        </div>
                                    </Stack>
                                    <Link href={'/merchant/stores/'+storeData.store_hash+'/dropdown-filters'}>
                                        <Button sx={{maxWidth:'300px'}} variant={'contained'}>Edit Dropdown Filters</Button>
                                    </Link>
                                </Stack>
                            )
                    )

            }
        </>
    )
}

const GeneralInfo = ({storeData}) => {
    
    const syncProductCatalog = () => {
        fetch(`/api/merchant/stores/${storeData.store_hash}/indexing/product-catalog`)
    }
    
    const syncFitmentSheet = () => {
        fetch(`/api/merchant/stores/${storeData.store_hash}/indexing/fitment-data`)
    }
    
    return(
        <div>
            <Button onClick={syncProductCatalog}>Sync Product Catalog</Button>
            <Button onClick={syncFitmentSheet}>Sync Fitment Sheet</Button>
            <Stack spacing={2}>
                <div><strong>Store Hash:</strong> <span> {storeData.store_hash}</span></div>
                <div><strong>Store Name:</strong> <span> {storeData.store_name}</span></div>
            </Stack>
            <Button sx={{marginTop:'20px'}} fullWidth={false} variant={'contained'}>Edit General Info</Button>
        </div>
    )
}


export default function StoreData({storeData}) {
  const [value, setValue] = React.useState('0');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{padding:'20px'}}>
        <div style={{display:'flex', gap: '10px', alignItems:'center'}}>
            <IconButton onClick={() => history.back()} aria-label="add an alarm">
                <ArrowBackIcon />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" href="/merchant/stores">
                    stores
                </Link>
                <Typography sx={{ color: 'text.primary' }}>{storeData.store_hash}</Typography>
            </Breadcrumbs>
        </div>
        <Divider sx={{margin:'10px 0'}}></Divider>
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {
                            tabData(storeData).map((tab, index) => (
                                <Tab label={tab.label} value={index.toString()} />
                            ))
                        }
                    </TabList>
                </Box>
                {
                    tabData(storeData).map((tab, index) => (
                        <TabPanel key={index} value={index.toString()}>
                            {tab.tabContent}
                        </TabPanel>
                    ))
                }
            </TabContext>
        </Box>
    </Paper>
  );
}
