import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Box } from '@mui/material';
import axios from 'axios';

const RecentlySold = () => {
  const [listings, setListings] = useState([]);
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/recently_sold_listings');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchData();
  }, []);

  const sortedListings = [...listings].sort((a, b) => {
    const dateA = new Date(a.Date_Sold_Rented.split('/').reverse().join('-'));
    const dateB = new Date(b.Date_Sold_Rented.split('/').reverse().join('-'));
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <Box sx={{ paddingY: 8, paddingX: 3, backgroundColor: '#1c1c1c' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom color="red">
          Recently Sold Listings
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: '#2b2b2b', color: 'white' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Address</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Bedrooms</TableCell>
                <TableCell sx={{ color: 'white' }}>Bathrooms</TableCell>
                <TableCell sx={{ color: 'white' }}>Price</TableCell>
                <TableCell sx={{ color: 'white' }}>Size (m²)</TableCell>
                <TableCell sx={{ color: 'white' }}>Estimate ($)</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <TableSortLabel
                    active
                    direction={sortDirection}
                    onClick={toggleSortDirection}
                  >
                    Date Sold
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedListings.map((listing, index) => (
                <TableRow key={index}>
                  <TableCell>{listing.Address}</TableCell>
                  <TableCell>{listing.Type}</TableCell>
                  <TableCell>{listing.Bedrooms}</TableCell>
                  <TableCell>{listing.Bathrooms}</TableCell>
                  <TableCell>{listing.Price_Buy}</TableCell>
                  <TableCell>{listing.Size_m2}</TableCell>
                  <TableCell>{listing.Estimate}</TableCell>
                  <TableCell>{listing.Date_Sold_Rented}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default RecentlySold;
