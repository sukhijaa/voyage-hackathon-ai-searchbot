export const buildItineraryFromComponents = (req, res) => {
    console.log(req.body);

    const response = {
        hotels: [],
        flights: []
    }

    response.hotels.push({
        name: "ABc REst ABc REst ABc REst ABc REst",
        description: "test description test description test description test description test description test description test description",
        originalPrice: 250,
        finalPrice: 200,
        iconURL: "",
        redirectionURL: "/hotelDummy",
        id: "ABC1"
    })

    response.hotels.push({
        name: "ABc REst 2",
        description: "test description 2",
        originalPrice: 350,
        finalPrice: 300,
        iconURL: "",
        redirectionURL: "/hotelDummy",
        id: "ABC2"
    })

    response.flights.push({
        name: "ABc Flight 1",
        description: "test description 1",
        originalPrice: 1000,
        finalPrice: 950,
        iconURL: "",
        redirectionURL: "/flightDummy",
        id: "ABC3"
    })

    response.flights.push({
        name: "ABc Flight 2",
        description: "test description 2",
        originalPrice: 1200,
        finalPrice: 1100,
        iconURL: "",
        redirectionURL: "/flightDummy",
        id: "ABC4"
    })

    res.json(response)
}