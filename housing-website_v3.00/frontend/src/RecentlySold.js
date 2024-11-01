import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel } from '@mui/material';
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
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Recently Sold Listings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Bedrooms</TableCell>
              <TableCell>Bathrooms</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Size (m²)</TableCell>
              <TableCell>Estimate ($)</TableCell>
              <TableCell>
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
  );
};

export default RecentlySold;
