import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Slice
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const slice = createSlice({
  name: "messages",
  initialState: {
    messages: [{ nombre: "juan", mensaje: "holi", _id: "1" }],
  },
  reducers: {
    pushMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
    setMessages: (state, action) => {
      state.messages = action.payload.data;
    },
    removeMessages: (state, action) => {
      state.messages = [];
    },
  },
});

export default slice.reducer;

// Actions

const { pushMessage, setMessages, removeMessages } = slice.actions;

export const addMessage = (username, message) => async (dispatch) => {
  try {
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
    let data = await axios.get(`${ENDPOINT}/messages/${token}`);
    dispatch(setMessages(data));
  } catch (e) {
    return console.error(e.message);
  }
};

export const deleteMessages = (token) => async (dispatch) => {
  try {
    let response = await axios.delete(`${ENDPOINT}/messages/${token}`)
    dispatch(removeMessages());
  } catch (e) {
    return console.error(e.message);
  }
};
