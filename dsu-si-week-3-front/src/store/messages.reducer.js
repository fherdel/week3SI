import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const url = 'http://localhost:3001/messages';
// Slice

const slice = createSlice({
  name: "messages",
  initialState: {
    messages: [ { nombre: 'juan', mensaje: 'holi', _id: '1' } ],
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

export const addMessage = (user, message) => async (dispatch) => {
let { username } = user;
  try {
    let data = await axios.post(url, { user, message })
    if(!data.data.error) dispatch(pushMessage({ message, username }));
  } catch (e) {
    return console.error(e.message);
  }
};

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const getMessages = () => async (dispatch) => {
  try {
    let data = await axios.get(url);
    if(!data.data.error) {
      console.log("data: ", data.data);
      dispatch(setMessages(data));

    }
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};
