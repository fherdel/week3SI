import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
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
    removeMessages: (state, action) => {
      state.messages = [];
    },
  },
});

export default slice.reducer;

// Actions

const { pushMessage, setMessages, removeMessages } = slice.actions;

export const addMessage = (username, message) => async (dispatch) => {
console.log('user: ', username);
console.log('message: ', message);
  try {
    // await axios.post("http://localhost:3001/message", {
    //     username,
    //     message,
    //   })
    dispatch(pushMessage({ message, username }));
  } catch (e) {
    return console.error(e.message);
  }
};

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const getMessages = () => async (dispatch) => {
  try {
    let data = await axios.get("http://localhost:3001/messages");
    console.log("data: ", data);
    dispatch(setMessages(data));
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};

export const deleteMessages = () => async (dispatch) => {
  try {
    let data = await axios.delete("http://localhost:3001/messages");
    console.log("data: ", data);
    dispatch(removeMessages());
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};
