import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bills';

// Get user's bills
export const getBills = createAsyncThunk(
  'bills/getBills',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(API_URL, config);
      return response.data.data.bills;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new bill
export const createBill = createAsyncThunk(
  'bills/createBill',
  async (billData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(API_URL, billData, config);
      return response.data.data.bill;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create payment order
export const createPaymentOrder = createAsyncThunk(
  'bills/createPaymentOrder',
  async (billId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(`${API_URL}/${billId}/payment`, {}, config);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify payment
export const verifyPayment = createAsyncThunk(
  'bills/verifyPayment',
  async (paymentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(`${API_URL}/verify-payment`, paymentData, config);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  bills: [],
  currentBill: null,
  paymentOrder: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload;
    },
    clearPaymentOrder: (state) => {
      state.paymentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bills = action.payload;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createPaymentOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.paymentOrder = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedBill = action.payload.bill;
        state.bills = state.bills.map(bill => 
          bill._id === updatedBill._id ? updatedBill : bill
        );
        state.currentBill = updatedBill;
        state.paymentOrder = null;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset, setCurrentBill, clearPaymentOrder } = billSlice.actions;
export default billSlice.reducer;
