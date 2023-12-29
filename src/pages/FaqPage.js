import "./FaqPage.css";
import Layout from "../components/layout/Layout.js";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

const FAQs = [
  {
    question: "How to use this POC?",
    answer: "Please watch this video for details: ",
  },
  {
    question: "How it works?",
    answer:
      "Based on your first input, we go to ChatGPT to ask for startDate, endDate, destination, destinationAirportCode in 4 individual queries. For the components still not parsed, we ask user for the input. Once all input components are processed, we hit Hotel Search and Flight Search API",
  },
  {
    question: "What are some valid input messages?",
    answer: (
      <ul>
        <h4>Here are some of the valid inputs:{" "}</h4>
        <li>I want to go to sydney in first week of june 2024</li>{" "}
        <li>I want to attend Wimbledon Final in July 2024</li>{" "}
        <li>
          Plan an itinerary for to travel to eiffel tower in September 2024
        </li>{" "}
      </ul>
    ),
  },
  {
    question: "What it can't do?",
    answer:
      "We're basing our POC on ChatGPT Turbo 3.5. This model doesn't have internet access so queries like 'next year', 'exact date of some event' etc are not deduced by it",
  },
  {
    question: "How we create itinerary?",
    answer: "We filter hotels and flights based on input budget such that Cheapest Hotel + Costliest Flight and Costliest Hotel + Cheapest Flight fit user's budget"
  },
  {
    question: "Which technology did we use?",
    answer: (
      <ul>
        <h4>Below are the technologies used:</h4> <li>Frontend : ReactJS</li>{" "}
        <li>Backend : NodeJS</li> <li>Cloud: AWS</li>{" "}
      </ul>
    ),
  },
  {
    question: "What is our Git Repo",
    answer: "https://github.com/sukhijaa/voyage-hackathon-ai-searchbot"
  }
];

const FUTURE_SCORE = [
  {
    question: "Different forms of input",
    answer: "We had planned to take Voice and Image input as well in original idea but decided to go ahead with Text Search only since firstly, Voice Input can be converted to text input using Google Speech to Text or OpenAI's Speech to Text Tools. Secondly, we dropped image input since OpenAI restricts query limit to 1 per minute for media search and hence we dropped that too."
  },
  {
    question: "Real Time Search Data",
    answer: "ChatGPT doesn't support real-time search data like date of some sports event, date of some carnival etc. We had planned to use Google's Bard.ai but it's available for API integration only to few users whose waitlist got approved."
  },
  {
    question: "Dynamic Itinerary",
    answer: "We wanted to take theme of travel (vacation, business, sports, medical etc.) as input and then ask Bard for places matching this theme (thier lat-long and date) and show hotels and flights accordingly. But we couldn't do it since Hotel API doesn't expose the theme of Hotel currently. We know TBO has this data, all we need is to expose it in API for that to work."
  }
];

function RenderOneSide({ items, title }) {
  return (
    <div className="faq-half-side">
      <h2>{title}</h2>
      {items.map((obj) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              {obj.question}
            </AccordionSummary>
            <AccordionDetails>{obj.answer}</AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

function FaqPage() {
  return (
    <Layout title={"FAQs"}>
      <div className="faq-wrapper">
        <RenderOneSide items={FAQs} title={"What's covered in this POC"} />
        <RenderOneSide
          items={FUTURE_SCORE}
          title={"What all was in our scope"}
        />
      </div>
    </Layout>
  );
}

export default FaqPage;
