import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { verifyPayment, clearPaymentOrder } from '../features/bills/billSlice';

const PaymentModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { currentBill, paymentOrder, isLoading } = useSelector((state) => state.bills);

  useEffect(() => {
    if (paymentOrder && currentBill) {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: paymentOrder.order.amount,
        currency: 'INR',
        name: 'E-Vitaran',
        description: `Bill Payment for ${currentBill.month} ${currentBill.year}`,
        order_id: paymentOrder.order.id,
        handler: function (response) {
          dispatch(
            verifyPayment({
              billId: currentBill._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
          );
          onClose();
        },
        prefill: {
          name: currentBill?.userId?.name,
          email: currentBill?.userId?.email
        },
        theme: {
          color: '#1976d2'
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    }
  }, [paymentOrder, currentBill, dispatch, onClose]);

  const handleClose = () => {
    dispatch(clearPaymentOrder());
    onClose();
  };

  if (!currentBill || !paymentOrder) {
    return null;
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Payment Details</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Bill Month: {currentBill.month} {currentBill.year}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Units Consumed: {currentBill.unitsConsumed}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Amount: ₹{currentBill.amount.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              * You will be redirected to Razorpay payment gateway
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
