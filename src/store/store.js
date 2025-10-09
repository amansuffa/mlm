import { configureStore } from '@reduxjs/toolkit';
import planReducer from '@/features/plans/planSlice';

export const store = configureStore({
  reducer: {
    plans: planReducer, 
  },
});