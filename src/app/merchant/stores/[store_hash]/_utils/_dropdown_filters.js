import * as React from 'react';
import { Alert, Chip,  Divider,  Stack} from '@mui/material';
import Link from 'next/link';
import { Button } from '@mui/joy';

export  function DropdownFilters({storeData})  {

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
                        <Stack spacing={2}>
                            <Alert severity={'error'}>
                                Google Sheet URL has not been added
                            </Alert>
                            <Alert severity={'info'}>
                                The header columns in the google sheet will appear as dropdown filters
                            </Alert>
                            
                        </Stack>

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
                                <Stack spacing={3}>
                                    <Stack spacing={1}>
                                        <strong>Column containing Product ID</strong> 
                                        <div><Chip sx={{minWidth:'100px'}} variant="outlined" label={productColumn} /></div>
                                    </Stack>
                                    <Stack spacing={1}>
                                        <div><strong>Dropdown Filters</strong></div>
                                        <div>
                                            {dropdownFilters.map((df, index) => {
                                                return(
                                                    <Chip sx={{minWidth:'100px'}} style={{marginRight: '10px'}} variant="outlined" label={df.label} key={index} />
                                                )
                                            })}
                                        </div>
                                    </Stack>
                                    <Divider></Divider>
                                    <Link href={'/merchant/stores/'+storeData.store_hash+'/dropdown-filters'}>
                                        <Button sx={{maxWidth:'300px'}} variant={'solid'}>Edit Dropdown Filters</Button>
                                    </Link>
                                </Stack>
                            )
                    )
            }
        </>
    )
}