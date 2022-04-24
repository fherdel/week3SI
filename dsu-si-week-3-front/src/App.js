import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { login, logout, singin } from "./store/user.reducer";

import { getMessages, addMessage } from "./store/messages.reducer";
import socketIOClient from "socket.io-client";
import Messages from "./components/Messages";
import ChatBar from "./components/ChatBar";
const dotenv = require('dotenv');
// get config vars
dotenv.config();
const ENDPOINT = "http://localhost:3001";
let socket;
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if(user){
    dispatch(getMessages());
    socket = socketIOClient(ENDPOINT);
    console.log("socket: ", socket);

    socket.on("chatMessageEmitted", ({ username, message }) => {
      dispatch(addMessage(username, message));
    });

    socket.on("clearMessages", (x) => {
      console.log("clear messages: ", x);
    });}
  }, [user]);

  const emitMessage = (username, message) => {
    console.log("-----", username);
    socket.emit("chatMessageEmitted", {
      username,
      message,
    });
    dispatch(addMessage(username, message));
  };

  /**
   * add logic to create users
   */
  const handleSingIn = async (values, setSubmitting) => {
    console.log("handleSingIn");
    console.log("values: ", values);
    setSubmitting(true);
    dispatch(singin(values));
    setSubmitting(false);
  };

  // socket events

  return (
    <div>
      {!user ? (
        <div style={{ margin: "20px" }}>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, { setSubmitting }) => {
              console.log("submiting");
              setSubmitting(true);
              await dispatch(login(values));
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
      ) : (
        <>
          <div>
            {user.username}
            <button onClick={() => dispatch(logout())}>Logout</button>
          </div>

          <Messages />
          <ChatBar emitMessage={emitMessage} />
        </>
      )}
    </div>
  );
}

export default App;
