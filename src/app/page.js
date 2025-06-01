import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper
} from '@mui/material';

import HeroSection from './components/home-page/hero';

import Features from './components/home-page/features';

export default function LandingPage() {
  
  return (
    <div style={{marginTop:'-30px'}}>
      {/* Top Navbar */}

      <HeroSection />

      <Features />

      {/* Footer */}
      <Box textAlign="center" py={4} borderTop="1px solid #e0e0e0">
        <Typography variant="body2" color={'success'}>
          © {new Date().getFullYear()} YMMFinder — All rights reserved.
        </Typography>
      </Box>
    </div>
  );
}
