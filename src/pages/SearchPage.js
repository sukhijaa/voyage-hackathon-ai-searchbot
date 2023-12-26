import "./SearchPage.css";
import Layout from "../components/layout/Layout.js";
import { SendTCPMessage } from "../utils/SendTCPMessage.js";
import { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { appendChat, resetChat } from "../store/chatbotReducer.js";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "../components/chatitem/ChatItem.js";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchComponents from "../components/searchComponents/SearchComponents.js";

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
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, showLoader] = useState(false);
  const interactions = useSelector((state) => state.chatbot.interactions);
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);

  const systemInteractions = interactions.filter(
    (intObj) => (intObj.components && !!Object.keys(intObj.components).length) || (intObj.responseOptions && !!Object.keys(intObj.responseOptions).length)
  );
  const latestInteraction = systemInteractions.length
    ? systemInteractions[systemInteractions.length - 1]
    : {};
  const showOptionsDataType =
    latestInteraction?.responseOptions?.showOptions &&
    latestInteraction?.responseOptions?.dataType;

  const handleMessageReceived = (data) => {
    console.log("SearcgPage - " + JSON.stringify(data));
    dispatch(appendChat(data, "SERVER"));
    if (data.stopLoader) {
      showLoader(false)
    }
  };

  useEffect(() => {
    getConnection(handleMessageReceived);
    return () => {
      closeConnection();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [interactions]);

  const handleSend = () => {
    if (!input || errorMsg) {
      return;
    }
    // getConnection()
    dispatch(
      appendChat(
        {
          type: "chat",
          message: input,
          components: (latestInteraction || {}).components,
        },
        "SELF"
      )
    );
    tcpEvictHelper.connection.sendMessage({
      message: input,
      components: (latestInteraction || {}).components,
      responseOptions: (latestInteraction || {}).responseOptions,
    });
    setInput("");
    showLoader(true)
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);

    if (showOptionsDataType === "date") {
      const dateVal = new Date(value);
      if (
        !dateVal ||
        dateVal.getTime() < new Date().getTime() ||
        dateVal.getTime() > new Date().getTime() + 365 * 24 * 60 * 60 * 1000
      ) {
        setErrorMsg("Please enter a valid value within next 1 year");
        return;
      }

      const { components, responseOptions } = latestInteraction;
      if (responseOptions?.gte && components?.[responseOptions.gte]) {
        const refValue = new Date(components[responseOptions.gte]);
        if (dateVal < refValue) {
          setErrorMsg(
            "Please select a value less than " + components[responseOptions.gte]
          );
          return;
        }
      }

      if (responseOptions?.lte && components?.[responseOptions.lte]) {
        const refValue = new Date(components[responseOptions.lte]);
        if (dateVal > refValue) {
          setErrorMsg(
            "Please select a value greater than " +
              components[responseOptions.lte]
          );
          return;
        }
      }

      setErrorMsg("");
    }
  };

  const handleStartover = (e) => {
    dispatch(resetChat());
    e.stopPropagation();
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Layout title={"Search"}>
      <div className="search-body">
        <SearchComponents
          components={latestInteraction.components || {}}
          onStartOver={handleStartover}
        />
        <div className="search-chat-area">
          {(interactions || []).map((item, index) => {
            return <ChatItem item={item} key={index} />;
          })}
          <div ref={chatEndRef} />
        </div>
        <div className="search-chat-input">
          <TextField
            label={showOptionsDataType ? "" : "Enter Your Query"}
            onChange={handleInput}
            value={input}
            autoComplete="off"
            onKeyDown={handleKeyDown}
            inputProps={{ autoComplete: "off" }}
            type={showOptionsDataType ? showOptionsDataType : "text"}
            error={!!errorMsg}
            helperText={errorMsg}
          />
          {
            loading ? <CircularProgress/> : <Send onClick={handleSend}></Send>
          }
        </div>
      </div>
    </Layout>
  );
}

export default SearchPage;
