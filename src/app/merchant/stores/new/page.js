'use client'
import { Alert, Box, Container, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Button } from "@mui/joy";
export default function NewStore({params}){

    const [isLoading, setIsLoading ] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault();

        const userConfirmed = window.confirm("Are you sure 'modify' access has been granted to scopes 'Sites & routes', 'Content', and 'Products' ?");

        if(!userConfirmed){
            toast('Store creation cancelled')
            return 
        }
        
        const userConfirmed2 = window.confirm("Are you sure to create store confirming access token and store hash are correct?");

        if(!userConfirmed2){
            toast('Store creation cancelled')
            return 
        }

        const formData = new FormData(e.currentTarget);
        const store_hash = formData.get('store_hash')

        try{
            
            setIsLoading(true)

            const response  = await fetch('/api/merchant/stores', { method: 'POST', body: formData });

            const responseJSON = await response.json() 
            

            if(responseJSON.success == true ){
                toast(responseJSON.message)
                console.log("helo1234")
                window.location.href = '/merchant/stores/'+store_hash
            }
            
        }catch(error){
            toast(error.message)
            setIsLoading(false)
        }

    };

    return(
        <Container maxWidth="sm"style={{marginBottom:'40px'}}>
            <Paper elevation={4} sx={{ p: 4, mt: 6 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Add new Store
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Store Name" name="store_name" required fullWidth />
                    <TextField label="Store Hash" name="store_hash" required fullWidth />
                    <Alert severity={'warning'}>Store hash can not be edited again later</Alert>
                    <Alert severity={'info'}>
                        Please provide <strong>modify</strong> access to following scopes: 
                        <strong>Sites & routes, Content, </strong>and <strong>Products</strong> while creating API token
                    </Alert>
                    <TextField label="Access Token" name="access_token" type="password"  fullWidth required/>
                    <Button loading={isLoading} type="submit" variant="solid">Add Store</Button>
                </Box>
            </Paper>
        </Container>
    )
}