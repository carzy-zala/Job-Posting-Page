import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../Feature/adminSlice.js";

const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});

export default store;
