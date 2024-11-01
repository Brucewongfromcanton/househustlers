// src/components/Header.js

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Housing Market Tracker
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/recently-sold">Recently Sold</Button>
          <Button color="inherit" component={Link} to="/#about">About Me</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
