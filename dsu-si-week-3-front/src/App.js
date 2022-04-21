import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { login, logout, signup } from "./store/user.reducer";

import { getMessages, addMessage, deleteAll } from "./store/messages.reducer";
import socketIOClient from "socket.io-client";
import Messages from "./components/Messages";
import ChatBar from "./components/ChatBar";

const ENDPOINT = "http://localhost:3001";
let socket;
function App() {
  const [status, setStatus]=useState(false)
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getMessages());
    socket = socketIOClient(ENDPOINT);
    console.log("socket: ", socket);

    socket.on("chatMessageEmitted", ({ username, message }) => {
      dispatch(addMessage( username, message ))
    });

    socket.on("clearMessages", (x) => {
      console.log("clear messages: ",x);
      //handleReset()   
    });
  }, []);
  const emitMessage = (username, message) => {
    socket.emit("chatMessageEmitted", {
      username,
      message,
    });
    dispatch(addMessage( user, message ))
  };
  //deslogearese
  const handelLogOut = async () => {
    setStatus(false)
    dispatch(logout())   
  };
  //eliminar todos los mensajes
  const handleReset = async () => {
    dispatch(deleteAll())   
  };
  //handle for signup
  const handleSignUp = async (values, setSubmitting) => {
    setSubmitting(true);
    const response=await dispatch(signup(values))
    console.log(response)
    setSubmitting(false);
  };

  // socket events

  return (
    <div>
      <div style={{ margin: "20px" }} hidden={status} >
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            setStatus(await dispatch(login(values)));
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
              <h1>Welcome</h1>
              <p>Sign in or sign up please!</p>
              <Field type="text" name="username" id="name" style={{ marginLeft: "20px" }}/>
              <Field type="password" name="password" id="pass" style={{ marginLeft: "20px" }}/>
              <button type="submit" disabled={isSubmitting}
              style={{ marginLeft: "20px" }}
              >
                Login
              </button>
              <button
              style={{ marginLeft: "20px" }}
              type="button"
                onClick={() => handleSignUp(values, setSubmitting)}
                disabled={isSubmitting}
              >
                Sing in
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div style={{ margin: "20px" }} hidden={!status} >
      {user!==null&&'Usuario: '+user}
        <button onClick={() => handelLogOut()} style={{ marginLeft: "20px" }}>Logout</button>
        <button onClick={() => handleReset()} style={{ marginLeft: "40px" }}>Borrar todos los mensajes</button>
      </div>
      <div hidden={(user===null)}>
      <Messages  />
      <ChatBar emitMessage={emitMessage}/>
      </div>
    </div>
  );
}

export default App;
