import { createSlice } from "@reduxjs/toolkit";
import { getMessages } from "../store/messages.reducer";
import axios from "axios";

// Slice

// const initialUser = localStorage.getItem('user')
//   ? JSON.parse(localStorage.getItem('user'))
//   : null

const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    id:null,
    token:null
  },
  reducers: {
    signUpSuccess: (state, action) => {
      state.user = action.payload._doc.username;      
      state.id = action.payload._doc._id;
      state.token = action.payload.token;
      //localStorage.setItem('user', JSON.stringify(action.payload))
    },
    loginSuccess: (state, action) => {
      state.user = action.payload._doc.username;      
      state.id = action.payload._doc._id;
      state.token = action.payload.token;
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
     let data = await axios.post(process.env.REACT_APP_URLBACK+"/users", {
       username,
       password,
     });
     console.log("data: desde signup", data.data._doc);
     dispatch(signUpSuccess(data.data)); 
     dispatch(getMessages(data.data.token));                
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
      let data = await axios.post(process.env.REACT_APP_URLBACK+"/login", {
        username,
        password,
      });
      if (data.data.username!==false) {
        console.log("data: desde login", data.data);
        dispatch(loginSuccess(data.data));        
          dispatch(getMessages(data.data.token));                
        return true
      } else {
        alert("Credenciales incorrectas")
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
