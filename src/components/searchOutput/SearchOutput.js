import React, { useState } from "react";
import "./SearchOutput.css";
import { Button, Card } from "@mui/material";
import { useSelector } from "react-redux";

const IndividualSearchItem = (props) => {
    const {item, handleSelect, selectedItem} = props;

    const handleAdd = () => {
        handleSelect(item.id === selectedItem ? "" : item.id)
    }

    return (
        <Card elevation={2} className="output-item-wrapper">
            <div className="output-item-image">

            </div>
            <div className="output-item-details">
                <div className="output-item-title">
                    {item.name}
                </div>
                <div className="output-item-description">
                    {item.description}
                </div>
                <div className="output-item-actions">
                    <div className="output-item-price">
                        <span className="strike font14px">${item.originalPrice}</span>
                        <span className="font18px bold">${item.finalPrice}</span>
                    </div>
                    <div className="output-item-add">
                        <Button variant="outlined" className={item.id === selectedItem ? "orangebg" : "bluebg"} onClick={handleAdd}>
                            {item.id === selectedItem ? "Added" : "Add"}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

const SearchOutput = () => {
    const searchOutput = useSelector(state => state.chatbot.searchOutput)
    const [selectedHotel, setSelectedHotel] = useState("")
    const [selectedFlight, setSelectedFlight] = useState("");

    const handleHotelSelect = (id) => {
        setSelectedHotel(id);
    }

    const handleFlightSelect = (id) => {
        setSelectedFlight(id)
    }

    const selectedCount = (selectedHotel ? 1 : 0) + (selectedFlight ? 1 : 0)
    const selectedHotelObj = (searchOutput.hotels || []).find(obj => obj.id === selectedHotel)
    const selectedFlightObj = (searchOutput.flights || []).find(obj => obj.id === selectedFlight)
    const totalPrice = (selectedHotelObj?.finalPrice || 0) + (selectedFlightObj?.finalPrice || 0);

    return (
        <Card className="search-output-wrapper" elevation={3}>
            <div className="search-output-results">
                <div className="search-output-results-label font14px">
                    We're done. Pleease find below the hotels and flights curated as per your need
                </div>
                <div className="search-output-results-table">
                    <div className="search-output-hotels">
                        {
                            searchOutput.hotels.map(hotel => {
                                return (
                                    <IndividualSearchItem item={hotel} handleSelect={handleHotelSelect} selectedItem={selectedHotel}/>
                                )
                            })
                        }
                    </div>
                    <div className="search-output-flights">
                    {
                            searchOutput.flights.map(flight => {
                                return (
                                    <IndividualSearchItem item={flight} handleSelect={handleFlightSelect} selectedItem={selectedFlight}/>
                                )
                            })
                        }
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
                    <Button variant="outlined" disabled={selectedCount === 0}>
                        Book Now
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default SearchOutput