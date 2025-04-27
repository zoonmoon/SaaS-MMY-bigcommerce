
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const sanitizeString = (input) => input
.replace(/\s+/g, '-')        // replace spaces with dashes
.replace(/[^a-zA-Z0-9-]/g, '') // remove everything except alphanumerics and dashes
// .toLowerCase();                  // Convert to lowercase

export function LoadingSpinner({minHeight = '100px'}) {
  return (
    <Box sx={{ display: 'flex', background:'white', justifyContent: 'center', alignItems: 'center', minHeight }}>
      <CircularProgress />
    </Box>
  );
}

