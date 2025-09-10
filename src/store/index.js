import { configureStore } from '@reduxjs/toolkit';
import appDataReducer from "./features/appData/appDataSlice";
import marketSlice from "./features/markets/marketSlice";
import FlowSlice from "./features/FlowOfApp/FlowSlice";
import modalReducer from './features/ModalController/modalController';


export default configureStore({
  reducer: {
    appData: appDataReducer,
    markets: marketSlice,
    FlowApp: FlowSlice,
    modal: modalReducer,
  },
})