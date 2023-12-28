import "./SearchPage.css";
import Layout from "../components/layout/Layout.js";
import { SendTCPMessage } from "../utils/SendTCPMessage.js";
import { useEffect, useRef, useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import {
  appendChat,
  resetChat,
  setFinalizedComponents,
} from "../store/chatbotReducer.js";
import { useDispatch, useSelector } from "react-redux";
import ChatItem from "../components/chatitem/ChatItem.js";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchComponents from "../components/searchComponents/SearchComponents.js";
import { handleDataSearch } from "../store/searchDetailsThunk.js";
import SearchOutput from "../components/searchOutput/SearchOutput.js";

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
  const searchOutput = useSelector((state) => state.chatbot.searchOutput);
  const dispatch = useDispatch();
  const chatEndRef = useRef(null);

  const systemInteractions = interactions.filter(
    (intObj) =>
      (intObj.components && !!Object.keys(intObj.components).length) ||
      (intObj.responseOptions && !!Object.keys(intObj.responseOptions).length)
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
      showLoader(false);
    }
    if (data.isFinished) {
      dispatch(handleDataSearch(data.components));
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
    showLoader(true);
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
    } else if (showOptionsDataType === "number") {
      const intValue = parseInt(value);
      const responseOptions = latestInteraction.responseOptions || {};

      if (intValue > responseOptions.max || intValue < responseOptions.min) {
        setErrorMsg(
          `Value must be between ${responseOptions.min || 0} and ${
            responseOptions.max || 0
          }`
        );
      } else {
        setErrorMsg("");
      }
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

  const searchOutputExists = (searchOutput?.hotels?.length > 0) || (searchOutput?.flights?.length > 0)

  return (
    <Layout title={"Search"}>
      <div className="search-body">
        <div className={searchOutputExists ? "search-chat-area detailsOpen" : "search-chat-area"}>
          <SearchComponents
            components={latestInteraction.components || {}}
            onStartOver={handleStartover}
          />
          <div className={"search-chat-interactions"}>
            {(interactions || []).map((item, index) => {
              return <ChatItem item={item} key={index} />;
            })}
            <div ref={chatEndRef} />
          </div>
        </div>
        {searchOutputExists ? (
          <div className="search-chat-output">
            <SearchOutput/>
          </div>
        ) : (
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
            {loading ? (
              <CircularProgress />
            ) : (
              <Send onClick={handleSend}></Send>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default SearchPage;
