import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import billReducer from '../features/bills/billSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bills: billReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
