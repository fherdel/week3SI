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
    deleteAllMessages: (state, action) => {
      state.messages = [{username:"Admin", message:"Sin mensajes aun"}];
    },
  },
});

export default slice.reducer;

// Actions

const { pushMessage, setMessages, deleteAllMessages } = slice.actions;

export const addMessage = (username, message) => async (dispatch) => {
  try {
    dispatch(pushMessage({ message, username }));
  } catch (e) {
    return console.error(e.message);
  }
};

//obtener todos los mensajes
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

//eliminar todos los mensajes
export const deleteAll = () => async (dispatch) => {
    try {
      let data = await axios.delete("http://localhost:3001/messages");
      console.log(data)
      dispatch(deleteAllMessages());
    } catch (e) {
      return console.error(e.message);
    }
  };