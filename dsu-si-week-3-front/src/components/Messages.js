import React from "react";
import "./messages.css"
import { useSelector } from "react-redux";

export default function Messages() {
  const { messages } = useSelector((state) => state.messages);
  console.log("messages: ?????", messages);
  return (
    <div style={{ margin: "10px 20px", height: 500, overflowY: "auto", height:"80vh" }} >
      <h2 >Chat:</h2>
      <div className="messages">
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            margin: "4px 4px",
            borderWidth: "3px",
            fontSize: "1rem",
          }}
        >
         <h6 style={{fontWeight:"500"}}>{message.username || "unknown"}</h6> 
          <p
            style={{
              margin: "4px 12px",
              fontSize: ".7rem",
            }}
          >
            {message.message}
          </p>
        </div>
      ))}</div>
    </div>
  );
}
