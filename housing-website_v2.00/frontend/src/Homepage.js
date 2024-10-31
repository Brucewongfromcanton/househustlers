// src/components/HomePage.js

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Container, Typography, Paper, Box, MenuItem, FormControl, Select, InputLabel, TextField, Button } from '@mui/material';
import axios from 'axios';
import Header from './Header';
import banner from './banner.jpg';

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

  // Fetch housing data with predictions from both models
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

  // Fetch population data for selected suburb and City of Boroondara
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

  // Custom prediction handler
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
      <Header />

      <Box sx={{ width: '100%', height: 'auto', position: 'relative', mb: 4 }}>
        <img src={banner} alt="House Hustlers Banner" style={{ width: '100%', height: 'auto' }} />
      </Box>

      <Container maxWidth="lg">
        {/* Housing Data Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Housing Market Predictions
          </Typography>

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

          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : (
            <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: '#ffffff' }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Year" type="number" domain={[2019, 2028]} tickCount={10} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    data={housingData.linear}
                    stroke="#0000FF"
                    name="Linear Regression"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    data={housingData.decision_tree}
                    stroke="#FF0000"
                    name="Decision Tree"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </Box>

        {/* Population Data Section */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Population Comparison
          </Typography>

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

          <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: '#f0f0f0' }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Year" type="number" domain={[2021, 2046]} tickCount={6} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Population"
                  data={boroondaraData}
                  stroke="#008000"
                  name="City of Boroondara"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="Population"
                  data={suburbData}
                  stroke="#FF0000"
                  name={selectedSuburb}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Box>

        {/* Custom Prediction Section */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h3" align="center" gutterBottom>
            Custom Prediction
          </Typography>

          <TextField
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            type="number"
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

          <Button variant="contained" color="primary" onClick={handlePredict} sx={{ mt: 2 }}>
            Get Prediction
          </Button>

          {predictionResult && (
            <Box sx={{ mt: 4, p: 3, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6">Prediction Results for {predictionResult.year}</Typography>
              <Typography>Category: {predictionResult.category}</Typography>
              <Typography>Linear Model Prediction: {predictionResult.linear_prediction}</Typography>
              <Typography>Decision Tree Prediction: {predictionResult.decision_tree_prediction}</Typography>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default HomePage;

           
