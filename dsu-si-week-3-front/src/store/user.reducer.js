import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Slice

// const initialUser = localStorage.getItem('user')
//   ? JSON.parse(localStorage.getItem('user'))
//   : null

const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      //localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logoutSuccess: (state, action) => {
      state.user = null;
      //localStorage.removeItem('user')
    },
  },
});

export default slice.reducer;

// Actions

const { loginSuccess, logoutSuccess } = slice.actions;

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      let data = await axios.post("http://192.168.1.10:3001/login", {
        username,
        password,
      });
      console.log("data: ", data);
      dispatch(loginSuccess());
    } catch (e) {
      console.log("e: ", e);
      return console.error(e.message);
    }
  };

/**
 * agregue aca la logica para desloguear usuario
 */
export const logout = () => async (dispatch) => {
  try {
    // *****
    return dispatch(logoutSuccess());
  } catch (e) {
    return console.error(e.message);
  }
};
