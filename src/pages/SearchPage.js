import "./SearchPage.css";
import Layout from "../components/layout/Layout.js";
import { SendTCPMessage } from "../utils/SendTCPMessage.js";
import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { appendChat, resetChat } from "../store/chatbotReducer.js";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "../components/chatitem/ChatItem.js";

const tcpEvictHelper = {
  hrClearIntervalMethod: () => {},
  bpClearIntervalMethod: () => {},
  connection: null,
};

const getConnection = (listener) => {
  if (
    !tcpEvictHelper.connection ||
    !tcpEvictHelper.connection.isConnectionValid()
  ) {
    tcpEvictHelper.connection = new SendTCPMessage(listener);
  }
};

const closeConnection = () => {
  if (tcpEvictHelper.connection) {
    tcpEvictHelper.connection.closeConnection();
  }
};

function SearchPage() {
  const [input, setInput] = useState("");
  const interactions = useSelector(state => state.chatbot.interactions)
  const dispatch = useDispatch()
  const chatEndRef = useRef(null)

  const handleMessageReceived = (data) => {
    console.log("SearcgPage - " + JSON.stringify(data));
    dispatch(appendChat(data, "SERVER"))
  };

  useEffect(() => {
    getConnection(handleMessageReceived);
    return () => {
      closeConnection();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [interactions])

  const handleSend = () => {
    if (!input) {
      return
    }
    dispatch(appendChat({type: "chat", message: input}, "SELF"))
    tcpEvictHelper.connection.sendMessage(input)
    setInput("")
  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const handleStartover = () => {
    dispatch(resetChat())
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <Layout title={"Search"}>
      <div className="search-body">
        <div className="search-chat-startover">
          <Button onClick={handleStartover}>Start Over</Button>
        </div>
        <div className="search-chat-area">
          {
            (interactions || []).map((item, index) => {
              return <ChatItem item={item} key={index}/>
            })
          }
          <div ref={chatEndRef}/>
        </div>
        <div className="search-chat-input">
          <TextField label="Enter Your Query" onChange={handleInput} value={input} autoComplete="off" onKeyDown={handleKeyDown} inputProps={{autoComplete: "off"}}/>
          <Send onClick={handleSend}></Send>
        </div>
      </div>
    </Layout>
  );
}

export default SearchPage;
