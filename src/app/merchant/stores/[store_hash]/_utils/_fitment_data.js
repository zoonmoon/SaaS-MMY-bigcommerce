import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Divider, Stack, TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { Button } from '@mui/joy';

export function FitmentDataSource({storeData}){

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


    const [isSyncingFitmentSheet, setIsSyncingFitmentSheet] = React.useState(false )

    const syncFitmentSheet = async () => {

        try{
            setIsSyncingFitmentSheet(true) 
            const response = await fetch(`/api/merchant/stores/${storeData.store_hash}/indexing/fitment-data`)
            const responseJSON = await response.json() 
            if(responseJSON.success !== true) throw new Error(responseJSON.message) 
            toast('Fitment data synchronized') 
        }catch(error){
            toast(error.message) 
        }finally{
            setIsSyncingFitmentSheet(false )
        }
        
    }

    return(
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stack spacing={3} sx={{marginTop: 0}}>
                {
                    spreadsheet_url.trim().length == 0 ? (
                        <Alert  severity={'info'}>
                            Please enter the google sheet URL.
                            Grant view access to everyone having a link.
                        </Alert>
                    ): (
                        <div>
                            <Button loading={isSyncingFitmentSheet} variant={'outlined'} onClick={syncFitmentSheet}>Synchronize Fitment Sheet</Button>
                        </div>
                    )
                }
                <Divider></Divider>
                <Stack sx={{marginTop: 0, paddingTop: 0}} spacing={2}>
                    <input type="hidden" name="doc_id" value={storeData.id} />
                    <TextField sx={{marginTop: '0px!important'}}  label="Google Sheet URL" name="spreadsheet_url" value={storeData.spreadsheet_url}   />
                    <div>
                        <Button  loading={isLoading} type="submit" variant={'outlined'} >Update Fitment Sheet URL</Button>
                    </div>
                </Stack>

            </Stack>

        </Box>
    )

}
