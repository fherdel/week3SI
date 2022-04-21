import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { login, logout, singin } from "./store/user.reducer";

import { getMessages, addMessage } from "./store/messages.reducer";
import socketIOClient from "socket.io-client";
import Messages from "./components/Messages";
import ChatBar from "./components/ChatBar";
import config from './config/config';

const ENDPOINT = config;
let socket;
function App() {
  const [isSingIn,SetIsSingIn] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    
    socket = socketIOClient(ENDPOINT.BACKEND);
    console.log("socket: ", socket);

    socket.on("chatMessageEmitted", ({ username, message }) => {
      dispatch(addMessage( username, message ))
    });

    socket.on("clearMessages", (x) => {
      console.log("clear messages: ", x);
    });
  }, []);

  


  const emitMessage = (username, message) => {
    socket.emit("chatMessageEmitted", {
      username,
      message,
    });
    dispatch(addMessage( username, message ))
  };

  /**
   * add logic to create users
   */
  const handleSingIn = async (values, setSubmitting) => {
    console.log("handleSingIn");
    console.log("values: ", values);
    setSubmitting(true);
    //dispatch(createUser(user,message))
    
    SetIsSingIn(true)
    setSubmitting(false);
  };

  // socket events

  if (user) {
    return (
      <div>
        {user.username}
        <button onClick={() => dispatch(logout())}>Logout</button>
        <Messages  />
      <ChatBar emitMessage={emitMessage}/>
      </div>
    );
  }

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <Formik
          initialValues={{ username: "", password: "" }}
          
          onSubmit={async (values, { setSubmitting }) => {
            console.log("submiting");
            setSubmitting(true);
            isSingIn ? await dispatch(singin(values)) : await dispatch(login(values));
            values.password = ''
            values.username = ''
            SetIsSingIn(false)
            setSubmitting(false);
          }}
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Required";
            } else if (!values.password) {
              errors.password = "Required";
            }
            return errors;
          }}
        >
          {({ isSubmitting, values, setSubmitting }) => (
            <Form>
              <Field type="text" name="username" />
              <Field type="password" name="password" />
              <button type="submit" disabled={isSubmitting}>
                Login
              </button>
              <button
                onClick={() => handleSingIn(values, setSubmitting)}
                disabled={isSubmitting}
              >
                Sing in
              </button>
            </Form>
          )}
        </Formik>
      </div>
      
    </div>
  );
}

export default App;
