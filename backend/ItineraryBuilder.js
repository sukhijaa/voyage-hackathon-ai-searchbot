import fetch from "node-fetch";
import { getAccessToken, getCityCode } from "./DataStore.js";
import { convertCurrency } from "./CurrencyConverter.js";

const getDateStr = (dateObj) => {
  const year = dateObj.getFullYear();
  const month =
    dateObj.getMonth() < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1;
  const date =
    dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
  return `${year}-${month}-${date}`;
};

const dayArr = ["Sun", "Mon", "Tue", "Wed","Thu", "Fri","Sat"] 
const getDayOfWeek = (dateStr) => {
    const dateObj = new Date(dateStr)
    if (!dateObj) {
        return ""
    }

    return dayArr[dateObj.getDay()]
}

const getHourStr = (dateStr) => {
    const dateObj = new Date(dateStr);
    const hourStr = `00${dateObj.getHours()}`
    const minutesStr = `00${dateObj.getMinutes()}`
    return `${hourStr.substring(hourStr.length - 2)}:${minutesStr.substring(minutesStr.length - 2)}`
}

const fetchHotels = async (components) => {
  const cityCode = getCityCode(components.destination);

  if (!cityCode) {
    throw new Error("Error fetching city code. Please startover the search");
  }

  const request = {
    CheckIn: getDateStr(new Date(components.startDate)),
    CheckOut: getDateStr(new Date(components.endDate)),
    HotelCodes: "",
    CityCode: cityCode,
    GuestNationality: "IN",
    PreferredCurrencyCode: "USD",
    PaxRooms: [
      {
        Adults: components.passengers,
        Children: 0,
        ChildrenAges: [],
      },
    ],
    IsDetailResponse: true,
    ResponseTime: 23,
  };

  let response = {};

  try {
    const responseObj = await fetch(
      "https://apiwr.tboholidays.com/HotelAPI/HotelSearch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + process.env.HOTE_BASIC_AUTH,
        },
        body: JSON.stringify(request),
      }
    );

    response = await responseObj.json();
  } catch (e) {
    console.error("Error fetching hotels. Error " + e);
    throw e;
  }

  if (
    response &&
    response.HotelSearchResults &&
    response.HotelSearchResults.length
  ) {
    const hotels = response.HotelSearchResults.map((obj) => {
      return {
        name: obj.HotelInfo.HotelName,
        description: obj.HotelInfo.HotelDescription,
        iconURL: obj.HotelInfo.HotelPicture,
        redirectionURL: "https://www.tboholidays.com/#sticky-nav",
        id: obj.HotelInfo.HotelCode,
        originalPrice: obj.MinHotelPrice.OriginalPrice,
        finalPrice: obj.MinHotelPrice.TotalPrice,
        fulfilmentScore: 2
      };
    });
    hotels.sort((a, b) => {
        return a.finalPrice - b.finalPrice
    })
    return hotels
  }
  throw new Error(
    "No hotels found for given search. Response " + JSON.stringify(response)
  );
};

const fetchFlights = async (components, clientIp) => {
  const authToken = await getAccessToken();

  if (!authToken) {
    throw new Error("Unable to generate access token");
  }

  const startDateStr = getDateStr(new Date(components.startDate));
  const endDateStr = getDateStr(new Date(components.endDate));

  const request = {
    EndUserIp: clientIp,
    TokenId: authToken,
    AdultCount: components.passengers,
    ChildCount: "0",
    InfantCount: "0",
    DirectFlight: "false",
    OneStopFlight: "false",
    JourneyType: "2",
    PreferredAirlines: null,
    Segments: [
      {
        Origin: components.sourceAirport,
        Destination: components.destinationAirport,
        FlightCabinClass: "1",
        PreferredDepartureTime: `${startDateStr}T00: 00: 00`,
        PreferredArrivalTime: `${startDateStr}T00: 00: 00`,
      },
      {
        Origin: components.destinationAirport,
        Destination: components.sourceAirport,
        FlightCabinClass: "1",
        PreferredDepartureTime: `${endDateStr}T00: 00: 00`,
        PreferredArrivalTime: `${endDateStr}T00: 00: 00`,
      },
    ],
    Sources: null,
  };

  let response = {};

  try {
    const responseObj = await fetch(
      "http://api.tektravels.com/BookingEngineService_Air/AirService.svc/rest/Search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(request),
      }
    );

    response = await responseObj.json();
  } catch (e) {
    console.error("Error fetching flights. Error " + e);
    throw e;
  }

  if (
    response &&
    response.Response &&
    response.Response.Results && 
    response.Response.Results.length
  ) {
    const flights = []
    for (let resultArr of response.Response.Results) {
        for (let result of resultArr) {
            const dataObj = {}
            const fare = result.Fare || {}
            const currency = fare.Currency;
            dataObj.originalPrice = await convertCurrency(currency, "USD", fare.PublishedFare)
            dataObj.finalPrice = await convertCurrency(currency, "USD", fare.OfferedFare)
            if (dataObj.originalPrice) {
                dataObj.originalPrice = parseInt(dataObj.originalPrice)
            }

            if (dataObj.finalPrice) {
                dataObj.finalPrice = parseInt(dataObj.finalPrice)
            } else {
                continue
            }
            
            const segments = result.Segments || []
            let name = ""; // DEL (Sun 11:30) → SIN (Sun 15:30) \n SIN (Sun 9:30) -> DEL (Mon 9:30)
            let description = ""
            let onwardName = ""
            let returnName = ""
            for (let segArr of segments) {
                for (let seg of segArr) {
                    const origin = seg.Origin.Airport.AirportCode;
                    const destination = seg.Destination.Airport.AirportCode
                    if (origin === components.sourceAirport) {
                        onwardName = `${origin} (${getDayOfWeek(seg.Origin.DepTime)}, ${getHourStr(seg.Origin.DepTime)}) -> `
                    }

                    if (destination === components.destinationAirport) {
                        onwardName += `${destination} (${getDayOfWeek(seg.Destination.ArrTime)}, ${getHourStr(seg.Destination.ArrTime)})`
                    }

                    if (origin === components.destinationAirport) {
                        returnName = `${origin} (${getDayOfWeek(seg.Origin.DepTime)}, ${getHourStr(seg.Origin.DepTime)}) -> `
                    }

                    if (destination === components.sourceAirport) {
                        returnName += `${destination} (${getDayOfWeek(seg.Destination.ArrTime)}, ${getHourStr(seg.Destination.ArrTime)})`
                    }
                    description += `${seg.Airline.AirlineName} - ${origin} (${getDayOfWeek(seg.Origin.DepTime)}, ${getHourStr(seg.Origin.DepTime)}) -> ${destination} (${getDayOfWeek(seg.Destination.ArrTime)}, ${getHourStr(seg.Destination.ArrTime)})||`
                }
            }

            if (onwardName && returnName) {
                dataObj.name = `${onwardName} || ${returnName}`
                dataObj.isComplete = true
            } else if (onwardName || returnName) {
                dataObj.name = onwardName + returnName;
                dataObj.isComplete = false
            } else {
                continue
            }

            dataObj.description = description;
            dataObj.iconURL = "/aeroplane.png";
            dataObj.redirectionURL = "https://www.tboholidays.com/#sticky-nav";
            dataObj.id = flights.length
            dataObj.fulfilmentScore = dataObj.isComplete ? 2 : (dataObj.name.startsWith(components.sourceAirport) ? 0.5 : 1.5)
            flights.push(dataObj);
        }
    }
    flights.sort((a, b) => {
        if (a.isComplete && b.isComplete) {
            return a.finalPrice - b.finalPrice
        }
        if (a.isComplete) {
            return -1
        }
        if (b.isComplete) {
            return 1
        }
        return a.finalPrice - b.finalPrice
    })
    return flights
  }
  throw new Error(
    "No flights found for given search. Response " + JSON.stringify(response)
  );
};

export const buildItineraryFromComponents = async (req, res) => {
  const components = req.body;

  const response = {
    hotels: [],
    flights: []
  };

  const clientIp =
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress;

  try {
    const hotelsPromise = fetchHotels(components);
    const flightsPromise = fetchFlights(components, clientIp);

    const [hotels, flights] = await Promise.all([hotelsPromise, flightsPromise])

    const returnFares = flights.filter(a => a.isComplete);
    const onwardFares = flights.filter(a => a.fulfilmentScore === 0.5)
    const upwardFares = flights.filter(a => a.fulfilmentScore === 1.5)

    const minValue = (arr) => {
        return arr && arr.length ? arr[0].finalPrice : Number.MAX_SAFE_INTEGER
    }

    const cheapestHotel = minValue(hotels)
    const minReturnFare = minValue(returnFares)
    const minOnwardFare = minValue(onwardFares)
    const minUpwardFare = minValue(upwardFares);

    const cheapestFlight = Math.min(minReturnFare, minOnwardFare + minUpwardFare);

    const eligibleHotels = hotels.slice(0, 10).filter(hotel => hotel.finalPrice + cheapestFlight <= components.budget)
    const eligibleReturnFares = returnFares.slice(0, 5).filter(flight => flight.finalPrice + cheapestHotel <= components.budget)
    const eligibleOnwardFare = onwardFares.slice(0, 5).filter(flight => flight.finalPrice + cheapestHotel + minUpwardFare <= components.budget)
    const eligibleUpwardFares = upwardFares.slice(0, 5).filter(flight => flight.finalPrice + cheapestHotel + minOnwardFare <= components.budget)

    const concat = eligibleReturnFares.concat(eligibleOnwardFare).concat(eligibleUpwardFares)
    
    response.hotels = eligibleHotels.length ? eligibleHotels : hotels.slice(0, 10)
    response.flights = concat.length ? concat : returnFares.slice(0, 5).concat(onwardFares.slice(0, 5)).concat(upwardFares.slice(0, 5))
    response.brief = eligibleHotels.length ? `Voila, we created an itinerary which is well under your budget starting at $${cheapestHotel + cheapestFlight}` : `Uh huh! Nothing fits your budget. Here are some most affordable suggestions`
  } catch (e) {
    console.error(e);
    res.status(500).send({});
    return;
  }

  res.json(response);
};
