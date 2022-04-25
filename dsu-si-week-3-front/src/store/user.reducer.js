import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      // localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logoutSuccess: (state, action) => {
      console.log(state.user)
      state.user = null;
      // localStorage.removeItem('user')
    },
    signinSuccess: (state, action) => {
      state.user = action.payload;
      // localStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
});

export default slice.reducer;

// Actions

const { loginSuccess, logoutSuccess, signinSuccess } = slice.actions;

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const login =
  ({ username, password }) =>
  async (dispatch) => {
    try {
      // console.log(username, password)
      let data = await axios.post("http://localhost:3001/login", {
        username,
        password,
      })
      if (data) {
        
      }
      console.log("data: ", data.data);
      dispatch(loginSuccess(data.data.username));
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
    return dispatch(logoutSuccess());
  } catch (e) {
    return console.error(e.message);
  }
};

export const signin = 
  ({ username, password }) => 
  async (dispatch) => {
    try {
      // console.log(username, password)
      let response = await axios.post("http://localhost:3001/signin", {
        username,
        password,
      })
      console.log("data: ", response.data.User.username);
      if (response.data.User.username) {
        dispatch(signinSuccess(response.data.User.username));
      }
    } catch (e) {
      return console.error(e.message);
    }
}