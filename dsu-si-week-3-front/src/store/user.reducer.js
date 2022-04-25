import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const slice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.username;
      state.token = action.payload.token
      // localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logoutSuccess: (state, action) => {
      // console.log(state.user)
      state.user = null;
      state.token = null;
      // localStorage.removeItem('user')
    },
    signinSuccess: (state, action) => {
      // console.log(action, "ho")
      state.user = action.payload.username;
      state.token = action.payload.token
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
      let response = await axios.post(`${ENDPOINT}/login`, {
        username,
        password,
      })
      if (response) {
        const payload = {
          username: response.data.username,
          token: response.data.token
        }
        // console.log("data: ", data.data);
        dispatch(loginSuccess(payload));
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
    return dispatch(logoutSuccess());
  } catch (e) {
    return console.error(e.message);
  }
};

export const signin = 
  ({ username, password }) => 
  async (dispatch) => {
    try {
      console.log(username, password)
      let response = await axios.post(`${ENDPOINT}/signin`, {
        username,
        password,
      })
      console.log("data: ", response.data);
      if (response.data.User.username && response.data.User.token) {
        const payload = {
          username: response.data.User.username,
          token: response.data.User.token
        }
        dispatch(signinSuccess(payload));
      }
    } catch (e) {
      return console.error(e.message);
    }
}