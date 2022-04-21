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
    id:null
  },
  reducers: {
    signUpSuccess: (state, action) => {
      state.user = action.payload;
      //localStorage.setItem('user', JSON.stringify(action.payload))
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.username;      
      state.id = action.payload._id;
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

const { loginSuccess, logoutSuccess, signUpSuccess } = slice.actions;
/**
 * agregue aca la logica para agregar los usuarios
 */
 export const signup =
 ({ username, password }) =>
 async (dispatch) => {
   try {
     let data = await axios.post("http://localhost:3001/users", {
       username,
       password,
     });
     console.log("data: desde signup", data);
     dispatch(signUpSuccess());
     return true
   } catch (e) {
     console.log("e: ", e);
     return console.error(e.message);
   }
 };

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      let data = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      if (data.data.username!==false) {
        console.log("data: desde login", data.data);
        dispatch(loginSuccess(data.data));
        return true
      } else {
        console.log(false)
      }
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
