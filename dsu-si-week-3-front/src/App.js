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

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
console.log(ENDPOINT)
let socket;
function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {  
      dispatch(getMessages(token));
      socket = socketIOClient(ENDPOINT);
      console.log("socket: ", socket);
      
      socket.on("chatMessageEmitted", ({ username, message }) => {
          dispatch(addMessage( user, message ))
        });
    
        socket.on("clearMessages", (x) => {
          console.log("clear messages: ", x);
        });
    }

  }, [user]);

  const emitMessage = (token, username, message) => {
    socket.emit("chatMessageEmitted", {
      token,
      username,
      message,
    });
    dispatch(addMessage( user, message ))
  };
  
  if (user) {
    return (
      <>
      <div>
        {user.username}
        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
      <button
        onClick={() => dispatch(deleteMessages(token))}
      >
        Delete Messages
      </button>
      <Messages  />
      <ChatBar emitMessage={emitMessage}/>
      </>
    );
  }



  /**
   * add logic to create users
   */
  const handleSingIn = async(values, setSubmitting) => {
    setSubmitting(true);
    await dispatch(signin(values))
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
              </>
              }
            </Form>
          )}
        </Formik>
      </div>
        <>
        </>

    </div>
  );
}

export default App;
