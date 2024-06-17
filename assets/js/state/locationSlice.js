import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    current: { pathname: '', search: '', hash: '', state: null },
    previous: { pathname: '', search: '', hash: '', state: null },
  },
  reducers: {
    setLocation: (state, action) => {
      state.previous = state.current;
      state.current = { ...action.payload };
    },
  },
});

export const { setLocation } = locationSlice.actions;
export const selectCurrentLocation = (state) => state.location.current;
export const selectPreviousLocation = (state) => state.location.previous;
export default locationSlice.reducer;
