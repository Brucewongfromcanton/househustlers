// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from './Homepage';
import RecentlySold from './RecentlySold';
import Header from './Header';
import AboutMe from './AboutMe'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff0000', // Red as primary color
    },
    secondary: {
      main: '#757575', // Grey as secondary color
    },
    background: {
      default: '#1c1c1c', // Dark grey background
      paper: '#333333',   // Slightly lighter grey for cards and paper elements
    },
    text: {
      primary: '#ffffff', // White text on dark background
      secondary: '#bdbdbd', // Light grey for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontSize: '2.4rem',
      fontWeight: 600,
      color: '#ff0000', // Red headers
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#ffffff', // White for subheaders
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      color: '#ffffff',
    },
    button: {
      textTransform: 'none',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Header /> {/* Including the header with navigation links */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recently-sold" element={<RecentlySold />} />
          <Route path="/about" element={<AboutMe />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
