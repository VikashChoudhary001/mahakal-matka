import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modalController',
  initialState: {
    isOpen: true, 
  },
  reducers: {
    showModal: (state) => {
      state.isOpen = true;
    },
    hideModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;

export default modalSlice.reducer;
