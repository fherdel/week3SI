import React, { useState, useRef } from "react";

import { useSelector } from "react-redux";


export default function ChatBar({ emitMessage }) {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  console.log('message: ', message);
  const messageSubmit = useRef()
  const sendMessage = () => {
    console.log(user, message);
    emitMessage(
      user || "unknown",
      message,
    );
  messageSubmit.current.value=""
  };

  return (
    <div style={{ margin: "10px 20px", overflowY: "auto" }}>
      <span style={{ width: "100%" }}>

        <input
        name="message"
        className="input is-success"
        value = {message}
          style={{ width: "90%" }}
          type="text"
          placeholder="Type message here"
          onChange={(e,x) => {
            setMessage(e.target.value)}}
            ref={messageSubmit}
        />
        <button onClick={sendMessage} disabled={false /* !user */} className="button is-success is-light">
          Submit
        </button>
      </span>
    </div>
  );
}
