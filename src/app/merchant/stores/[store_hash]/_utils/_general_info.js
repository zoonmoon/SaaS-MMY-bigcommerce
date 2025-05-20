import * as React from 'react';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField } from '@mui/material';
import { Button } from '@mui/joy';
import toast from 'react-hot-toast';

export function GeneralInfo ({storeData}){
    
    const syncProductCatalog = () => {
        fetch(`/api/merchant/stores/${storeData.store_hash}/indexing/product-catalog`)
    }
    
    const [isModalOpen, setIsModalOpen] = React.useState(false)


    const handleEditModal = () => setIsModalOpen(!isModalOpen)

    const DisplayEditForm = () => {
        
        const [isEditing, setIsEditing] = React.useState(false)

        const handleSubmit = async (e) => {

            e.preventDefault();
            
            const formData = new FormData(e.currentTarget);
            
            if(formData.get('access_token').trim().length > 0){

                const userConfirmed = window.confirm("Are you sure 'modify' access has been granted to scopes 'Sites & routes', 'Content', and 'Products' ?");

                if(!userConfirmed){
                    toast('Store updation cancelled')
                    return 
                }

                const userConfirmed2 = window.confirm("Are you sure access token is correct ?");

                if(!userConfirmed2){
                    toast('Store updation cancelled')
                    return 
                }

            }


            try{
                
                setIsEditing(true)
    
                const response  = await fetch(
                    `/api/merchant/stores`, 
                    { method: 'PUT', body: formData }
                );
                
                const responseJSON = await response.json() 
    
                if(responseJSON.success == false ) throw new Error(responseJSON.message)
                
                toast(responseJSON.message)

                // setIsModalOpen(!isModalOpen)

                window.location.reload()
                
            }catch(error){
                toast(error.message)
            }finally{
                setIsEditing(false)
            }
            
        };
    
        return(
            <Dialog
                open={true}
                onClose={()=>{}}
                fullWidth
                slotProps={{
                paper: {},
                }}
            >
                <DialogTitle>Edit Store Details</DialogTitle>
                <DialogContent style={{width:'100%'}}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth:'100%', paddingTop:1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <input type='hidden' name='doc_id' value={storeData.id} />
                        <div>
                            <TextField defaultValue={storeData.store_name} label="Store Name" name="store_name"  fullWidth />
                        </div>
                        <div>
                            <TextField type={'password'} defaultValue={''} label="Access Token" name="access_token"  fullWidth />
                            <div style={{marginTop:'10px'}}>
                                <Alert severity={'info'}>Access token field is empty by default as it is not viewable. Leave this field empty to avoid changing access token. If value is passed, it will be overridden. </Alert>
                            </div>
                        </div>
                        <DialogActions>
                            <Button variant={'outlined'} disabled={isEditing} onClick={handleEditModal}>Cancel</Button>
                            <Button loading={isEditing}  type="submit">Submit</Button>
                        </DialogActions>
                    </Box>
                </DialogContent>
            </Dialog>
        )
    }

    return(
        <div>
            {isModalOpen && (<DisplayEditForm />)}
            <Stack spacing={2}>
                <div><strong>Store Hash:</strong> <span> {storeData.store_hash}</span></div>
                <div><strong>Store Name:</strong> <span> {storeData.store_name}</span></div>
                <Alert severity={'info'}>Access token is not viewable for security purposes</Alert>
                <Divider></Divider>
            </Stack>
                <Button onClick={handleEditModal} sx={{marginTop:'20px'}} fullWidth={false} variant={'solid'}>Edit Store Details</Button>
        </div>
    )
}