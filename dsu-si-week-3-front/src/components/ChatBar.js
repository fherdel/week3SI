import React, { useState } from "react";

import { useSelector } from "react-redux";

export default function ChatBar({ emitMessage }) {
  const { user } = useSelector((state) => state.user);
  const [message, setMessage] = useState("");
  console.log('message: ', message);

  const sendMessage = () => {
    console.log(user, message);
    emitMessage(
      user || "unknown",
      message,
    );
  };

  return (
    <div style={{ margin: "10px 20px", overflowY: "auto" }}>
      <span style={{ width: "100%" }}>

        <input
        name="message"
        value = {message}
          style={{ width: "90%" }}
          type="text"
          placeholder="insert text here"
          onChange={(e,x) => {
            setMessage(e.target.value)}}
        />
        <button onClick={sendMessage} disabled={false /* !user */}>
          Submit
        </button>
      </span>
    </div>
  );
}
