import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/joy';
import Link from 'next/link';

const drawerWidth = 240;
const navItems = [{label: 'How it Works', href:'/how-it-works'}, {label: 'Pricing', href: '/pricing'}, {label: 'Contact us', href: '/contact-us'}];
const navItemsRight = [{label: 'Log In', href: '/login'}, {label: 'Register', href: '/register'}]

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <img  src={'/ymm-logo-3.png'} style={{borderRadius:'50%'}} width={'80px'} height={'auto'}/>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box  sx={{ display: 'flex', zIndex:5, top:0,  position:'sticky', marginBottom:'30px' }}>
      <CssBaseline />
      <AppBar color={'inherit'}  sx={{paddingTop:'8px', minHeight:'83px', paddingBottom:'8px', position:'unset'}} component="nav">
        <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <a href='/'>
            <img src={'/ymm-logo-3.png'} width={'60px'} />
          </a>
          
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Link href={item.href} key={item.label}>
                <Button variant={'plain'} >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItemsRight.map((item) => (
              <Link href={item.href} key={item.label}>
                <Button variant={'plain'}>
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
