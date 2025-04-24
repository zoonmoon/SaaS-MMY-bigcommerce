'use client'
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
export default function NewStore({params}){

    const [isLoading, setIsLoading ] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const store_hash = formData.get('store_hash')

        try{
            
            setIsLoading(true)

            const response  = await fetch('/api/merchant/stores', { method: 'POST', body: formData });

            const responseJSON = await response.json() 

            if(!responseJSON.success == false ) throw new Error(responseJSON.message)
            
            toast(responseJSON.message)

            if(responseJSON.success){
                window.location.href = '/merchant/stores/'+store_hash
            }
            
        }catch(error){
            toast(error.message)
        }finally{
            setIsLoading(false)
        }

    };

    return(
        <Container maxWidth="sm">
            <Paper elevation={4} sx={{ p: 4, mt: 10 }}>
                <Typography variant="h5" textAlign="center" gutterBottom>
                    Add new Store
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Store Name" name="store_name" required fullWidth />
                    <TextField label="Store Hash" name="store_hash" required fullWidth />
                    <TextField label="Access Token" name="access_token" type="password"  fullWidth />
                    <Button loading={isLoading} type="submit" variant="contained" size="large">Add Store</Button>
                </Box>
            </Paper>
        </Container>
    )
}