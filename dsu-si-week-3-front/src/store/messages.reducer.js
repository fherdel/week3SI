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
      console.log("action: ", action);
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
  console.log("user: ", username);
  console.log("message: ", message);
  try {
    const token= window.localStorage.getItem("token")
    await axios
      .post(process.env.REACT_APP_ENDPOINT_MESSAGES, {
        username: username.username,
        message: message,
      }, {
        headers: {
          'Authorization': `token ${token}`
        },
      })
      .then((response) => {
        console.log(response);
 dispatch(pushMessage({ message:message, username:username.username }));
      })
      .catch((err) => console.log(err));

   
  } catch (e) {
    return console.error(e);
  }
};

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const getMessages = () => async (dispatch) => {
  try {
    const token= window.localStorage.getItem("token")
    let data = await axios.get(process.env.REACT_APP_ENDPOINT_MESSAGES, {
      headers: {
        'Authorization': `token ${token}`
      },
    });
    console.log("data: ", data);
    dispatch(setMessages(data));
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};
