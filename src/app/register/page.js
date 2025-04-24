'use client'
import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Box
} from '@mui/material';
import Link from 'next/link';

import toast from 'react-hot-toast';

export default function Login() {

    const [isLoading, setIsLoading ] = useState(false)

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username')

        try{
            
            setIsLoading(true)

            const response  = await fetch('/api/auth/register', { method: 'POST', body: formData });

            const responseJSON = await response.json() 

            toast(responseJSON.message)

            if(responseJSON.success){
                window.location.href = '/merchant/stores'
            }

        }catch(error){

        }finally{
            setIsLoading(false)
        }

    };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Register
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Username" name="username" required fullWidth />
          <TextField label="Password" name="password" type="password" required fullWidth />
          <Button loading={isLoading} type="submit" variant="contained" size="large">Register</Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{' '}
            <Link style={{textDecoration:'underline'}} href="/login" >Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
