import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper
} from '@mui/material';

export default function LandingPage() {
  
  return (
    <>
      {/* Top Navbar */}


      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618173725164-d7bdfd9448f1)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: '300px', md: '400px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.5)', p: 4, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Power Your Auto Store with YMM Search
          </Typography>
          <Typography variant="body1">
            Fast and flexible Year/Make/Model lookup integration for BigCommerce.
          </Typography>
        </Box>
      </Paper>

      {/* Features Section */}
      <Container sx={{ mt: 6, mb: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">Easy Integration</Typography>
            <Typography variant="body2">
              Seamlessly plug into your BigCommerce store with our guided setup.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">Built for Automotive</Typography>
            <Typography variant="body2">
              Designed for performance parts, auto accessories, and more.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold">Lightning Fast Search</Typography>
            <Typography variant="body2">
              Help customers find the exact part they need in seconds.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Ready to get started?
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mr: 2 }}
        >
          Register Now
        </Button>
        <Button
          variant="outlined"
          size="large"
        >
          Login
        </Button>
      </Box>

      {/* Footer */}
      <Box textAlign="center" py={4} borderTop="1px solid #e0e0e0">
        <Typography variant="body2" color={'success'}>
          © {new Date().getFullYear()} YMM SaaS — All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
