import { createSlice } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

const initialState = {
  isAuthenticated: false,
  name: "",
};


const adminReducer = createSlice({
  name: "admin",
  initialState,
  reducers: {
    initialised: (state) => {
      if (localStorage.getItem("accessToken")) {
        state.isAuthenticated = true;
      }
    },
    verify: (state, action) => {
      state.name = action.payload.name;
      state.isAuthenticated = true;
    },
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = "";
    },
  },
});

export const { verify, login, logout, initialised } = adminReducer.actions;
export default adminReducer.reducer;
