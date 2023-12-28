import React from "react";
import "./SearchComponents.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, TextField } from "@mui/material";

const SearchComponents = (props) => {
  const { components, onStartOver } = props;

  return (
    <Accordion className="search-chat-components">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className="search-chat-accordion-title">Selected Components</Typography>
        <div className="search-chat-startover">
          <Button onClick={onStartOver}>Start Over</Button>
        </div>
      </AccordionSummary>
      <AccordionDetails className="search-chat-accordion-details">
        {
            Object.keys(components || {}).map(name => {
                const value = components[name];
                if (!value) {
                    return null
                }
                return (
                    <div className="search-chat-accordion-details-single-row-wrapper" key={name}>
                        <div className="search-chat-accordion-details-single-row-title">{name}</div>
                        <div className="search-chat-accordion-details-single-row-value">{value}</div>
                    </div>
                )
            })
        }
      </AccordionDetails>
    </Accordion>
  );
};

export default SearchComponents;
