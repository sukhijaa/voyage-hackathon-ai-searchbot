import React from "react";
import "./ChatItem.css";

const ChatItem = (props) => {
  const item = props.item;
  if (item.type === "connection") {
    return (
      <div className="search-chat-wrapper">
        <div className="search-chat-divider" />
        <span className="search-chat-message">{item.message}</span>
      </div>
    );
  }
  if (item.sender === "SELF") {
    return <div className="search-chat-self-bubble">{item.message}</div>;
  } else {
    return <div className="search-chat-system-bubble">{item.message}</div>;
  }
};

export default ChatItem;
