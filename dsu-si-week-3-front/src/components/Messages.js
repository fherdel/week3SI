import React from "react";
import { useSelector } from "react-redux";
export default function Messages() {
  const { messages } = useSelector((state) => state.messages);
  const { user } = useSelector((state) => state.user);
  return (
    <div style={{ margin: "10px 20px", height: 500, overflowY: "auto" }}>
      <h2 >Chat:</h2>
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            margin: "4px 4px",
            borderWidth: "3px",
            fontSize: "1rem",
          }}
        >
          {message.username===user?("My self"):(message.username)}:
          <p
            style={{
              margin: "4px 12px",
              fontSize: ".7rem",
            }}
          >
            {message.message}
          </p>
        </div>
      ))}
    </div>
  );
}
