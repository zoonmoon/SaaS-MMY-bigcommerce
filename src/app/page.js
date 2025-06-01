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

import FeatureHighlights from './components/home-page/highlights';

import HeroFinal from './components/home-page/hero-final';

export default function LandingPage() {
  
  return (
    <div style={{marginTop:'-30px'}}>
      {/* Top Navbar */}

      <HeroFinal />

      <Features />

      <FeatureHighlights />

      <h2 style={{fontSize:'30px', padding:'40px', textAlign:'center'}} className="elementor-heading-title elementor-size-default">Tools and expertise to make<br/> you succeed.</h2>

      <HeroSection />

      {/* Footer */}
      <Box textAlign="center" py={4} borderTop="1px solid #e0e0e0">
        <Typography variant="body2" color={'success'}>
          © {new Date().getFullYear()} YMMFinder — All rights reserved.
        </Typography>
      </Box>
    </div>
  );
}
