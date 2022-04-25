import React, { useEffect} from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik } from "formik";
import { login, logout, signin } from "./store/user.reducer";
// import {signin} from "./store/user.reducer"
import { getMessages, addMessage, deleteMessages } from "./store/messages.reducer";
import socketIOClient from "socket.io-client";
import Messages from "./components/Messages";
import ChatBar from "./components/ChatBar";

const ENDPOINT = "http://localhost:3001";
let socket;
// console.log(user)
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  console.log(user)
  useEffect(() => {
    dispatch(getMessages());
    socket = socketIOClient(ENDPOINT);
    console.log("socket: ", socket);
    
    socket.on("chatMessageEmitted", ({ username, message }) => {
        dispatch(addMessage( username, message ))
      });
  
      socket.on("clearMessages", (x) => {
        console.log("clear messages: ", x);
      });

  }, [dispatch]);

  if (user) {
    return (
      <div>
        {user.username}
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    );
  }


  const emitMessage = (username, message) => {
    socket.emit("chatMessageEmitted", {
      username,
      message,
    });
    dispatch(addMessage( user, message ))
  };

  /**
   * add logic to create users
   */
  const handleSingIn = async(values, setSubmitting) => {
    // console.log("handleSingIn");
    setSubmitting(true);
    await dispatch(signin(values))
    // console.log("values: ", values);
    setSubmitting(false);
    console.log(user)
  };

  // socket events

  return (
    <div>
      <div style={{ margin: "20px" }}>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values, { setSubmitting }) => {
            // console.log("submiting");
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
              {!user
              ?
              <>
              <button
                onClick={() => handleSingIn(values, setSubmitting)}
                disabled={isSubmitting}
              >
                Sing in
              </button>
              <button  
              type="submit"
              disabled={isSubmitting}>
                Login
              </button>
              </>
              :
              <>
              <button
                onClick={logout}
                disabled={isSubmitting}
              >
                Logout
              </button>
              <button
                onClick={deleteMessages}
                disabled={isSubmitting}
              >
                Delete Messages
              </button>
              </>
              }
            </Form>
          )}
        </Formik>
      </div>
      {/* {user
        && */}
        <>
          <Messages  />
          <ChatBar emitMessage={emitMessage}/>
        </>
      {/* } */}
    </div>
  );
}

export default App;
