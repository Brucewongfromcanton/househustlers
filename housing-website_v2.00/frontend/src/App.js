// src/App.js

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from './Homepage';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0000', // Red from the banner for primary buttons and highlights
    },
    secondary: {
      main: '#333333', // Dark gray/black for secondary elements
    },
    background: {
      default: '#f0f0f0', // Light gray for background
      paper: '#ffffff', // White for paper elements
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#333333', // Dark gray text for less prominent text
    },
  },
  typography: {
    h3: {
      fontSize: '2.5rem',
      color: '#ff0000', // Red for headers to align with banner
    },
    h5: {
      fontSize: '1.75rem',
      color: '#333333', // Dark gray for subheaders
    },
    body1: {
      fontSize: '1.1rem',
      color: '#000000', // Black for main text
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
