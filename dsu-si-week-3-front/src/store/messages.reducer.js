import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// Slice

const slice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
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

  try {
    const userToken = JSON.parse(localStorage.getItem('user'))
    console.log("token",userToken)  
    await axios.post(`http://${process.env.REACT_APP_MY_IP}:3001/message`, { username, message },{
      headers:{
        "Authorization" : `Bearer ${userToken.token}`
      }
    })
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
    const userToken = JSON.parse(localStorage.getItem('user'))
    let data = await axios.get(`http://${process.env.REACT_APP_MY_IP}:3001/messages`,{
      headers:{
        "Authorization" : `Bearer ${userToken.token}`
      }
    });
    console.log("data: Array ", data.data.data);
    dispatch(setMessages(data.data));
  } catch (e) {
    console.log("e: ", e);
    return console.error(e.message);
  }
};
