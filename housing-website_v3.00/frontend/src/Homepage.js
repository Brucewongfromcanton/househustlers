// src/components/HomePage.js

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Paper, Box, MenuItem, Card, CardMedia, CardContent, FormControl, Select, InputLabel, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import banner from './banner.jpg';
import teamPhoto1 from './teamPhoto1.jpg';
import teamPhoto2 from './teamPhoto2.jpg';
import teamPhoto3 from './teamPhoto3.jpg';
import mapImage from './MapImage.jpg';

const HomePage = () => {
  const [housingData, setHousingData] = useState({ linear: [], decision_tree: [] });
  const [boroondaraData, setBoroondaraData] = useState([]);
  const [suburbData, setSuburbData] = useState([]);
  const [selectedSuburb, setSelectedSuburb] = useState('City of Boroondara');
  const [selectedCategory, setSelectedCategory] = useState('mBuy_House');
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [propertyType, setPropertyType] = useState('house');
  const [transactionType, setTransactionType] = useState('buy');
  const [valueType, setValueType] = useState('price');
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    const fetchHousingData = async () => {
      try {
        setLoading(true);
        const linearResponse = await axios.get(`http://localhost:8000/housing_data?model_type=linear&category=${selectedCategory}`);
        const decisionTreeResponse = await axios.get(`http://localhost:8000/housing_data?model_type=decision_tree&category=${selectedCategory}`);
        setHousingData({
          linear: linearResponse.data.data || linearResponse.data,
          decision_tree: decisionTreeResponse.data.data || decisionTreeResponse.data,
        });
      } catch (error) {
        console.error('Error fetching housing data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCategory) fetchHousingData();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchPopulationData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/population_data?suburb=${selectedSuburb}`);
        setBoroondaraData(response.data.Boroondara);
        setSuburbData(response.data.Suburb);
      } catch (error) {
        console.error('Error fetching population data:', error);
      }
    };
    fetchPopulationData();
  }, [selectedSuburb]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSuburbChange = (event) => {
    setSelectedSuburb(event.target.value);
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post("http://localhost:8000/custom_prediction", {
        year: parseInt(year),
        property_type: propertyType,
        transaction_type: transactionType,
        value_type: valueType
      });
      setPredictionResult(response.data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  return (
    <div>
      {/* Banner Image */}
      <Box sx={{ width: '100%', height: 'auto', position: 'relative', mb: -1 }}>
        <img src={banner} alt="House Hustlers Banner" style={{ width: '100%', height: 'auto' }} />
      </Box>

      <Box sx={{ paddingY: 8, paddingX: 3, backgroundColor: '#1c1c1c' }}>
        <Container maxWidth="lg">
          <section style={{ paddingBottom: '4rem' }}>
            {/* Map Image Section */}
            <Box sx={{ marginTop: 4, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Our Location
              </Typography>
              <img src={mapImage} alt="Map of Our Location" style={{ width: '100%', maxWidth: '600px', height: 'auto', marginTop: '1rem' }} />
            </Box>
          </section>
          {/* Housing Market Predictions with Sidebar Controls */}
          <Box sx={{ my: 6 }}>
            <Typography variant="h3" align="center" gutterBottom color="red">
              Housing Market Predictions
            </Typography>
            <Grid container spacing={2}>
              {/* Controls for Housing Predictions and Custom Prediction */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel>Select Category</InputLabel>
                  <Select value={selectedCategory} onChange={handleCategoryChange}>
                    <MenuItem value="mBuy_House">Median House Price</MenuItem>
                    <MenuItem value="mBuy_Unit">Median Unit Price</MenuItem>
                    <MenuItem value="mRent_House">Median House Rent</MenuItem>
                    <MenuItem value="mRent_Unit">Median Unit Rent</MenuItem>
                    <MenuItem value="cBuy_House">House Sales Volume</MenuItem>
                    <MenuItem value="cBuy_Unit">Unit Sales Volume</MenuItem>
                    <MenuItem value="cRent_House">House Rental Volume</MenuItem>
                    <MenuItem value="cRent_Unit">Unit Rental Volume</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="h5" gutterBottom color="white">
                  Custom Prediction
                </Typography>
                <TextField
        label="Year"
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        inputProps={{ min: 2024, max: 2050 }}  // Enforce the year range
        placeholder="2024-2050"                 // Show range as placeholder
        helperText="Enter a year between 2024 and 2050"  // Additional guidance
        fullWidth
        margin="normal"
      />
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel>Property Type</InputLabel>
                  <Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                    <MenuItem value="house">House</MenuItem>
                    <MenuItem value="unit">Unit</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <MenuItem value="buy">Buy</MenuItem>
                    <MenuItem value="rent">Rent</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel>Value Type</InputLabel>
                  <Select value={valueType} onChange={(e) => setValueType(e.target.value)}>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="count">Count</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handlePredict}>
                  Get Prediction
                </Button>
                {predictionResult && (
                  <Box sx={{ mt: 4, p: 2, border: '1px solid #757575', borderRadius: '8px', backgroundColor: '#2b2b2b' }}>
                    <Typography variant="h6" color="white">
                      Prediction Results for {predictionResult.year}
                    </Typography>
                    <Typography color="text.secondary">
                      Category: {predictionResult.category}
                    </Typography>
                    <Typography color="text.secondary">
                      Linear Model Prediction: {predictionResult.linear_prediction}
                    </Typography>
                    <Typography color="text.secondary">
                      Decision Tree Prediction: {predictionResult.decision_tree_prediction}
                    </Typography>
                  </Box>
                )}
              </Grid>

              {/* Housing Market Prediction Chart */}
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3, backgroundColor: '#2b2b2b' }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Year" type="number" domain={[2019, 2028]} tickCount={10} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" data={housingData.linear} stroke="#ff0000" name="Linear Regression" />
                      <Line type="monotone" dataKey="value" data={housingData.decision_tree} stroke="#757575" name="Decision Tree" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Population Comparison Section */}
          <Box sx={{ my: 6 }}>
            <Typography variant="h3" align="center" gutterBottom color="red">
              Population Comparison
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ my: 2 }}>
                  <InputLabel>Select Suburb</InputLabel>
                  <Select value={selectedSuburb} onChange={handleSuburbChange}>
                    <MenuItem value="City of Boroondara">City of Boroondara</MenuItem>
                    <MenuItem value="Ashburton">Ashburton</MenuItem>
                    <MenuItem value="Balwyn">Balwyn</MenuItem>
                    <MenuItem value="Balwyn North">Balwyn North</MenuItem>
                    <MenuItem value="Camberwell">Camberwell</MenuItem>
                    <MenuItem value="Canterbury">Canterbury</MenuItem>
                    <MenuItem value="Deepdene">Deepdene</MenuItem>
                    <MenuItem value="Glen Iris">Glen Iris</MenuItem>
                    <MenuItem value="Hawthorn">Hawthorn</MenuItem>
                    <MenuItem value="Hawthorn East">Hawthorn East</MenuItem>
                    <MenuItem value="Kew">Kew</MenuItem>
                    <MenuItem value="Kew East">Kew East</MenuItem>
                    <MenuItem value="Surrey Hills">Surrey Hills</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3, backgroundColor: '#2b2b2b' }}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="Year" type="number" domain={[2021, 2046]} tickCount={6} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Population" data={boroondaraData} stroke="#ff0000" name="City of Boroondara" />
                      <Line type="monotone" dataKey="Population" data={suburbData} stroke="#757575" name={selectedSuburb} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default HomePage;
