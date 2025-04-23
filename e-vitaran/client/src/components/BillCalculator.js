import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  MenuItem
} from '@mui/material';
import { createBill } from '../features/bills/billSlice';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 2 }, (_, i) => currentYear - i);

const BillCalculator = () => {
  const [formData, setFormData] = useState({
    month: months[new Date().getMonth()],
    year: currentYear,
    unitsConsumed: ''
  });

  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.bills);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'unitsConsumed' ? value.replace(/[^0-9]/g, '') : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createBill(formData));
    setFormData({
      ...formData,
      unitsConsumed: ''
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Calculate Your Bill
        </Typography>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="month"
                label="Month"
                value={formData.month}
                onChange={handleChange}
                required
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="year"
                label="Year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="unitsConsumed"
                label="Units Consumed"
                type="text"
                value={formData.unitsConsumed}
                onChange={handleChange}
                required
                helperText="Enter the number of units consumed this month"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || !formData.unitsConsumed}
              >
                {isLoading ? 'Calculating...' : 'Calculate Bill'}
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            * Bill will be calculated based on current tariff rates
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default BillCalculator;
