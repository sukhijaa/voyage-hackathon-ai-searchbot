import React, { useState } from "react";
import "./SearchOutput.css";
import { Button, Card } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Replay } from "@mui/icons-material";
import { handleDataSearch } from "../../store/searchDetailsThunk";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { resetChat } from "../../store/chatbotReducer";

const IndividualSearchItem = (props) => {
  const { item, handleSelect, selectedItem, isCompact } = props;

  const index = selectedItem.findIndex(a => a.id === item.id)
  const isSelected = index !== -1;

  const handleAdd = () => {
    handleSelect(isSelected ? null : item);
  };

  return (
    <Card elevation={2} className="output-item-wrapper">
      <div className={clsx("output-item-image", isCompact && "compactOut")}>
        <img
          className={clsx("output-item-image", isCompact && "compactOut")}
          src={item.iconURL}
        />
      </div>
      <div className={clsx("output-item-details", isCompact && "compactOut")}>
        <div className={clsx("output-item-title", isCompact && "compactOut")}>
          {(item.name || "").split("||").map((name) => {
            return (
              <div>
                <Link to={item.redirectionURL}>{name}</Link>
              </div>
            );
          })}
        </div>
        <div
          className={clsx("output-item-description", isCompact && "compactOut")}
        >
          {(item.description || "").split("||").map((desc) => {
            return <div className={clsx(isCompact && "font10px")}>{desc}</div>;
          })}
        </div>
        <div className={clsx("output-item-actions", isCompact && "compactOut")}>
          <div className="output-item-price">
            {item.originalPrice > item.finalPrice ? (
              <span
                className={clsx("strike", "font14px", isCompact && "font10px")}
              >
                ${item.originalPrice}
              </span>
            ) : null}
            <span className={clsx("bold", "font18px", isCompact && "font14px")}>
              ${item.finalPrice}
            </span>
          </div>
          <div className={clsx("output-item-add", isCompact && "compactOut")}>
            <Button
              variant="outlined"
              className={isSelected ? "orangebg" : "bluebg"}
              onClick={handleAdd}
            >
              {isSelected ? "Added" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SearchOutput = () => {
  const searchOutput = useSelector((state) => state.chatbot.searchOutput);
  const searchError = useSelector((state) => state.chatbot.searchError);
  const finalizedComponents = useSelector(
    (state) => state.chatbot.finalizedComponents
  );
  const [selectedHotel, setSelectedHotel] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState([]);
  const dispatch = useDispatch();

  const handleHotelSelect = (item) => {
    if (!item) {
        setSelectedHotel([])
        return
    }
    setSelectedHotel([item]);
  };

  const handleFlightSelect = (item) => {
    if (!item) {
        setSelectedFlight([])
    }
    let newItems = [...selectedFlight];
    if (item.fulfilmentScore === 2) {
        newItems = [item];
    } else {
        const remainingItems = selectedFlight.filter(a => a.fulfilmentScore !== item.fulfilmentScore)
        newItems = [...remainingItems, item];
    }
    setSelectedFlight(newItems);
  };

  const handleRetry = () => {
    dispatch(handleDataSearch(finalizedComponents));
  };

  const handleBook = () => {
    dispatch(resetChat())
    alert("Booking Successful. Booking flow is not part of PoC so you can assume booking is complete. Don't pack your bags yet :)")
  }

  const selectedCount = selectedHotel.length + (selectedFlight.length);
  const totalPrice = selectedHotel.reduce((prev, item) => prev + item.finalPrice, 0) + selectedFlight.reduce((prev, item) => prev + item.finalPrice, 0)

  if (searchError) {
    return (
      <div className="search-chat-input">
        <div className="search-error">{searchError}</div>
        <Replay onClick={handleRetry} />
      </div>
    );
  }

  return (
    <Card className="search-output-wrapper" elevation={3}>
      <div className="search-output-results">
        <div className="search-output-results-label font14px">
          {searchOutput.brief ||
            "We're done. Pleease find below the hotels and flights curated as per your need"}
          <br />
          Please note, this list is fetched real-time using TBO APIs
        </div>
        <div className="search-output-results-table">
          <div className="search-output-hotels">
            {searchOutput.hotels.map((hotel) => {
              return (
                <IndividualSearchItem
                  item={hotel}
                  handleSelect={handleHotelSelect}
                  selectedItem={selectedHotel}
                />
              );
            })}
          </div>
          <div className="search-output-flights">
            {searchOutput.flights.map((flight) => {
              return (
                <IndividualSearchItem
                  item={flight}
                  handleSelect={handleFlightSelect}
                  selectedItem={selectedFlight}
                  isCompact={true}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="search-output-summary">
        <div className="search-output-summary-selected">
          <span className="bold">Total</span>
          <span className="font18px grow100">${totalPrice}</span>
          <span className="font14px">{selectedCount} items selected</span>
        </div>
        <div className="search-output-summary-book">
          <Button variant="outlined" disabled={selectedCount === 0} onClick={handleBook}>
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SearchOutput;
