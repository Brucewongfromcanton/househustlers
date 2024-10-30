// src/components/Header.js

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as ScrollLink } from 'react-scroll';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Housing Market Tracker
        </Typography>
        <Box>
          <ScrollLink to="home" smooth={true} duration={500}>
            <Button color="inherit">Home</Button>
          </ScrollLink>
          <ScrollLink to="about" smooth={true} duration={500}>
            <Button color="inherit">About Me</Button>
          </ScrollLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
