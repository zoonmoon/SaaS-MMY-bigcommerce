import * as React from 'react';
import { Alert, Divider, Stack } from '@mui/material';
import { Button } from '@mui/joy';
export function GeneralInfo ({storeData}){
    
    const syncProductCatalog = () => {
        fetch(`/api/merchant/stores/${storeData.store_hash}/indexing/product-catalog`)
    }
    
    return(
        <div>
            <Stack spacing={2}>
                <div><strong>Store Hash:</strong> <span> {storeData.store_hash}</span></div>
                <div><strong>Store Name:</strong> <span> {storeData.store_name}</span></div>
                <Alert severity={'info'}>Access token is not viewable / editable for security purposes</Alert>
                <Divider></Divider>
            </Stack>
            <Button sx={{marginTop:'20px'}} fullWidth={false} variant={'solid'}>Edit General Info</Button>
        </div>
    )
}