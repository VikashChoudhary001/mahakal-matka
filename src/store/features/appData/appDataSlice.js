import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch app data from the API
export const fetchAppData = createAsyncThunk('appData/fetchAppData', async () => {
  const response = await axios.get('/get-app-data');
  return response.data.response.appData;  // Directly returning the appData object
});

export const appDataSlice = createSlice({
  name: 'appData',
  initialState: {
    appData: {
      enable_desawar: null,
      enable_desawar_only: null,
    },
    readNotifications: localStorage.getItem("readNotifications") || 0,
    status: 'idle', 
    error: null 
  },
  reducers: {
    setAppData: (state, action) => {
      state.appData = action.payload;
    },
    setReadNotifications: (state, action) => {
      state.readNotifications = action.payload;
    },
    setAuthDataUsersSingleValue: (state, action) => {
      state.appData.user[action.payload.key] = action.payload.value;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAppData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { enable_desawar, enable_desawar_only } = action.payload;
        state.appData = {
          enable_desawar,
          enable_desawar_only,
        };
      })
      .addCase(fetchAppData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setAppData, setReadNotifications, setAuthDataUsersSingleValue } = appDataSlice.actions;

export default appDataSlice.reducer;
