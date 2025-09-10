import { createSlice } from '@reduxjs/toolkit';

const exampleSlice = createSlice({
  name: 'FlowApp',
  initialState: {
    AppNewView: true,
    HomeNewView: true,
    GameRate: true,
    GameHistory: true,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = exampleSlice.actions;
export default exampleSlice.reducer;
