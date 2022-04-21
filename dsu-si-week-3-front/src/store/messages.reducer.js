import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import config from '../config/config';
const ENDPOINT = config.BACKEND;
// Slice

const slice = createSlice({
  name: "messages",
  initialState: {
    messages: [{ nombre: "juan", mensaje: "holi", _id: "1" }],
  },
  reducers: {
    pushMessage: (state, action) => {
    console.log('action: ', action);
      state.messages = [...state.messages, action.payload];
    },
    setMessages: (state, action) => {
      state.messages = action.payload.data;
    },
  },
});

export default slice.reducer;

// Actions

const { pushMessage, setMessages } = slice.actions;

export const addMessage = (username, message) => async (dispatch) => {
console.log('user: ', username);
console.log('message: ', message);
  try {
    // await api.post('/message/', { user, message })
    dispatch(pushMessage({ message, username }));
  } catch (e) {
    return console.error(e.message);
  }
};

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const getMessages = (token) => async (dispatch) => {
  try {
    let data = await axios.get(`${ENDPOINT}/messages`,{ headers: {"Authorization" : `Bearer ${token}`} });
    console.log("data: ", data);
    dispatch(setMessages(data));
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};
