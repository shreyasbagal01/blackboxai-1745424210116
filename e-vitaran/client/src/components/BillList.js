import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { getBills, setCurrentBill, createPaymentOrder } from '../features/bills/billSlice';

const BillList = () => {
  const dispatch = useDispatch();
  const { bills, isLoading, isError, message } = useSelector((state) => state.bills);

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  const handlePayment = (bill) => {
    dispatch(setCurrentBill(bill));
    dispatch(createPaymentOrder(bill._id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography component="h1" variant="h5" gutterBottom>
        Your Bills
      </Typography>
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {bills.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No bills found</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Units Consumed</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill._id}>
                  <TableCell>{bill.month}</TableCell>
                  <TableCell>{bill.year}</TableCell>
                  <TableCell>{bill.unitsConsumed}</TableCell>
                  <TableCell>{bill.amount.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(bill.dueDate)}</TableCell>
                  <TableCell>
                    <Typography
                      color={bill.status === 'PAID' ? 'success.main' : 'error.main'}
                    >
                      {bill.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {bill.status === 'PENDING' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handlePayment(bill)}
                      >
                        Pay Now
                      </Button>
                    )}
                    {bill.status === 'PAID' && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="success"
                        disabled
                      >
                        Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default BillList;
