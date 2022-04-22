import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from 'react-redux'

// Slice

// const initialUser = localStorage.getItem('user')
//   ? JSON.parse(localStorage.getItem('user'))
//   : null

const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token:null
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
    singinSuccess: (state, action) => {
      state.user = action.payload;
      //localStorage.removeItem('user')
    },
    saveToken: (state, action) => {
      state.token = action.payload;
    },
    
  },
});

export default slice.reducer;

// Actions

const { loginSuccess, logoutSuccess, singinSuccess, saveToken } = slice.actions;

/**
 * agregue aca la logica para incrustar los usuarios
 */
 export const singin =
 ({ username, password }) =>
 async (dispatch) => {
   try {
     let data = await axios.post("http://localhost:3001/user", {
       username : username,
       password : password,
     });
     console.log("dataUser : ", data);
     
    dispatch(singinSuccess({username:username, password:password}));


     
   } catch (e) {
     console.log("e: ", e);
     return console.error(e.message);
   }
 };
export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      let data = await axios.post("http://localhost:3001/login", {
        username:username,
        password:password,
      });
      console.log("dataUser : ", data.data);
      dispatch(loginSuccess({username:username, password:password}));
      dispatch(saveToken({token:data.data.token}))
      window.localStorage.setItem("token", data.data.token)
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
    window.localStorage.clear()
    return dispatch(logoutSuccess());
  } catch (e) {
    return console.error(e.message);
  }
};



export function useToken() {
  return useSelector((state) => state.token)
}