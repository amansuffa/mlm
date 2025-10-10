import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  loading: true,
  error: null,
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: { 

    setLoading: (state) => {
      state.loading = true;
    },

    setPlans: (state, action) => {
      state.loading = false;
      state.plans = action.payload; 
      state.error = null;
    },
    
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    addPlan: (state, action) => {
      state.plans.push(action.payload);
    },
    
    updatePlan: (state, action) => {
      const index = state.plans.findIndex(plan => plan._id === action.payload._id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },

    deletePlan: (state, action) => {
      state.plans = state.plans.filter(plan => plan._id !== action.payload);
    }
  }
});

export const { 
  setLoading, 
  setPlans, 
  setError, 
  addPlan, 
  updatePlan, 
  deletePlan 
} = planSlice.actions;

export default planSlice.reducer;