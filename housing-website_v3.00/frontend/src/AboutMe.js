// src/components/AboutMe.js

import React from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Box } from '@mui/material';
import teamPhoto1 from './teamPhoto1.jpg';
import teamPhoto2 from './teamPhoto2.jpg';
import teamPhoto3 from './teamPhoto3.jpg';
import mapImage from './MapImage.jpg';

const AboutMe = () => {
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        We are a passionate team dedicated to building innovative solutions in the real estate industry.
        Our goal is to make housing information accessible and valuable for all.
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            <CardMedia component="img" alt="Team Member 1" height="300" image={teamPhoto1} />
            <CardContent>
              <Typography variant="h5">Haoqian Huang</Typography>
              <Typography variant="body2" color="text.secondary">
                104312084
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            <CardMedia component="img" alt="Team Member 2" height="300" image={teamPhoto2} />
            <CardContent>
              <Typography variant="h5">Kimsakona SOK</Typography>
              <Typography variant="body2" color="text.secondary">
              104526322
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            <CardMedia component="img" alt="Team Member 3" height="300" image={teamPhoto3} />
            <CardContent>
              <Typography variant="h5">Hayden Janecic</Typography>
              <Typography variant="body2" color="text.secondary">
              105339990
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Our Location
        </Typography>
        <img src={mapImage} alt="Map of Our Location" style={{ width: '100%', maxWidth: '600px', height: 'auto', marginTop: '1rem' }} />
      </Box>
    </Container>
  );
};

export default AboutMe;
