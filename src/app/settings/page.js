'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Container } from '@mui/material';

export default function BasicList() {
  return (
    <Container maxWidth={'md'}>
        <Box sx={{ width: '100%',  bgcolor: 'background.paper' }}>
            <nav aria-label="secondary mailbox folders">
                <List>
                    <ListItem o disablePadding>
                        <ListItemButton onClick={()=>window.location.href='/change-password'}>
                        <ListItemText primary="Change password" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>
        </Box>
    </Container>
  );
}
