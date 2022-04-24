import React, { useEffect } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { login, logout, singin } from "./store/user.reducer";

import { getMessages, addMessage } from "./store/messages.reducer";
import socketIOClient from "socket.io-client";
import Messages from "./components/Messages";
import ChatBar from "./components/ChatBar";
const dotenv = require("dotenv");
// get config vars
dotenv.config();
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
let socket;
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    if (user) {
      dispatch(getMessages());
      socket = socketIOClient(ENDPOINT);
      console.log("socket: ", socket);

      socket.on("chatMessageEmitted", ({ username, message }) => {
        dispatch(addMessage(username, message));
      });

      socket.on("clearMessages", (x) => {
        console.log("clear messages: ", x);
      });
    }
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
        <div
          style={{
            margin: "20px",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "20vh",
          }}
          class="container"
        >
          <div class="notification is-primary">
            <h1 className="is-size-1">Inicio de sesión</h1>
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
                  <label>Username</label>
                  <Field type="text" name="username" class="input is-success" />
                  <label>Password</label>
                  <Field
                    type="password"
                    name="password"
                    class="input is-success"
                  />
                  <div
                    style={{
                      marginTop: "3vh",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      class="button is-success is-light"
                    >
                      Login
                    </button>
                    <button
                      class="button is-success is-light"
                      style={{ marginLeft: "2vh" }}
                      onClick={() => handleSingIn(values, setSubmitting)}
                      disabled={isSubmitting}
                    >
                      Sing in
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ) : (
        <>
          <div style={{backgroundColor:"#00d1b2"}}>
            <h1 className="is-size-1" style={{color:"white"}}> {user.username}
            
            <button
              class="button is-success is-light"
              style={{position:"relative", left:"85%", top:"2vh"}}
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
            </h1>

        
    <div style={{backgroundColor:"white"}}>
<div style={{ height:"80vh"}}>
          <Messages /></div>
          <ChatBar emitMessage={emitMessage} />  </div>    </div>
        </>
      )}
    </div>
  );
}

export default App;
