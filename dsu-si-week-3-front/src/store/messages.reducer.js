import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Get a cookie
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// Slice
const slice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
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
    let config = {
      headers: {
        authorization: getCookie("token"),
      },
    };

    let data = await axios.post(
      "http://localhost:3001/messages",
      {
        username: username.username,
        message,
      },
      config
    );
    dispatch(pushMessage({ message, username:username.username }));
  } catch (e) {
    return console.error(e.message);
  }
};

/**
 * agregue aca la logica para incrustar los usuarios
 */
export const getMessages = () => async (dispatch) => {
  console.log('Holaaa')
  try {
    let config = {
      headers: {
        authorization: getCookie("token"),
      },
    };
    let data = await axios.get("http://localhost:3001/messages", config);

    if (!data.data.error) {
      console.log("data: ", data);
      dispatch(setMessages(data.data));
    } else {
      console.log("err bd: ", data.data.error);
      return alert(data.data.error);
    }
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};
