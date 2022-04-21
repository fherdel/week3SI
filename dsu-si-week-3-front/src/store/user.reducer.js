import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from '../config/config';
// Slice

// const initialUser = localStorage.getItem('user')
//   ? JSON.parse(localStorage.getItem('user'))
//   : null
const ENDPOINT = config.BACKEND;

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
    getCurrent: (state) => state,
  },
});

export default slice.reducer;

// Actions

const { loginSuccess, logoutSuccess,getCurrent } = slice.actions;

/**
 * agregue aca la logica para incrustar los usuarios
 */
 export const singin =
 ({ username, password }) =>
 async (dispatch) => {
   try {
     let data = await axios.post(`${ENDPOINT}/users`, {
       username,
       password,
     });
     console.log(data)
   } catch (e) {
     console.log("e: ", e);
     return console.error(e.message);
   }
 };

export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      let data = await axios.post(`${ENDPOINT}/login`, {
        username,
        password,
      });
      
      console.log("data: ",  data.data.data);
      dispatch(loginSuccess(data.data.data));
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
