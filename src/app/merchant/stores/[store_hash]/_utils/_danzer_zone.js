import { Button } from "@mui/joy";
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

export function DangerZone({storeData}){
    
    const [isLoading, setIsLoading]= useState(false) 

    const buttonText = `${storeData.active_status == 'active' ? `Deactivate`: 'Activate'} ${storeData.store_name}`

    let buttonColor = storeData.active_status == 'active' ? `danger`: 'success'

    let endpointPath = storeData.active_status == 'active' ? `danger-zone`: 're-activate'

    const handleStatusChange =  async () => {

        try{

            setIsLoading(true)

            const response = await fetch(`/api/merchant/stores/${storeData.store_hash}/${endpointPath}`, { method: 'POST'})

            const responseJSON = await response.json() 

            if(responseJSON.success !== true ) throw new Error(responseJSON.message)
            
            toast(responseJSON.message)

            window.location.href = '/merchant/stores'
            
        }catch(error){

            toast(error.message)

        }finally{
            
            setIsLoading(false)
        
        }
    }

    const [isDeleteModalOpen, setIsDeleteModalOpen]  = useState(false) 


    const handleDeactivate = () => {
        setIsDeleteModalOpen(!isDeleteModalOpen) 
    }

    const DeleteModal = () => {

        const handleDeleteConfirm = () => { 
            setIsDeleteModalOpen(!isDeleteModalOpen)
            handleStatusChange()
        } 

        const handleSubmit = (e) => {

            e.preventDefault()
            
            const formData = new FormData(e.currentTarget);

            const enteredText = formData.get('store_name_delete_confirm')

            if(enteredText.trim() === `Delete ${storeData.store_name}`){
                toast('Deactivating store...')
            }else{
                toast('Text does not match')
                return 
            }

            handleDeleteConfirm()
        }

        return(
            <Dialog
                open={true}
                onClose={()=>{}}
                fullWidth
                slotProps={{
                paper: {},
                }}
            >
                <DialogTitle>Deactivate Store</DialogTitle>
                <DialogContent style={{width:'100%'}}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth:'100%', paddingTop:1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Alert severity={'warning'}>
                            YMM dropdowns will no longer work after deactivation. YMM Scripts, YMM related widgets, and fitment data stored in your BigCommerce store will be wiped out.
                        </Alert>
                        <Alert severity={'info'}>Deactivating store deletes the scripts only related to YMM and does not touch other scripts and widgets</Alert>
                        <div>
                            Copy <strong><i>{`Delete ${storeData.store_name}`}</i></strong> and paste it in the following field to confirm deactivation
                        </div>
                        <div>
                            <TextField label={`Paste here`} name="store_name_delete_confirm"  fullWidth required/>
                        </div>
                        <DialogActions>
                            <Button variant={'solid'} color={'success'} onClick={handleDeactivate}>Cancel</Button>
                            <Button  type="submit" color={'danger'}>Confirm Deactivation</Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        )
    }

    return(
        <Stack spacing={2}>
            {
                endpointPath == 'danger-zone' && isLoading && (
                    <Alert severity={'info'}>Deactivation takes some time depending on the size of fitment data</Alert>
                )
            }
            {
                endpointPath != 'danger-zone' && (
                    <Alert severity={'info'}>
                        Reactivating store does not auto create the scripts and widgets.
                        We need to create them manually like we did while setting up for the first time.
                    </Alert>
                )
            }
            <div>
                <Button loading={isLoading} onClick={endpointPath != 'danger-zone' ?  handleStatusChange: handleDeactivate} color={buttonColor}>{buttonText}</Button>
            </div>
            {isDeleteModalOpen && (<DeleteModal />)}
        </Stack>
    )
}