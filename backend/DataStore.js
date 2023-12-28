import fetch from "node-fetch";
import dotenv from 'dotenv'
dotenv.config()

const countries = {};
const cities = {};
let airlineToken = ""
let tokenRefreshTime = new Date();

const refreshCountries = async () => {
    console.log("Starting to fetch list of countries")

    try {
        const response = await fetch("https://apiwr.tboholidays.com/HotelAPI/CountryList", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + process.env.HOTE_BASIC_AUTH
        }
    });

    const responseJson = await response.json();
    if (responseJson && responseJson.CountryList && responseJson.CountryList.length) {
        responseJson.CountryList.forEach(obj => {
            let countryName = obj.Name;
            if (!countryName) {
                return;
            }
            countryName = countryName.toLowerCase().trim();
            countries[countryName] = obj.Code
        })
        return true
    }
    } catch(e) {
        console.error("Failed to fetch countries. Error - " + e)
    }

    return false;
}

const refreshCityForACountry = async (CountryCode) => {
    console.log("Starting to fetch list of cities for " + CountryCode)
    try {
        const response = await fetch("https://apiwr.tboholidays.com/HotelAPI/CityList", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + process.env.HOTE_BASIC_AUTH
        },
        body: JSON.stringify({CountryCode})
    });

    const responseJson = await response.json();
    if (responseJson && responseJson.CityList && responseJson.CityList.length) {
        responseJson.CityList.forEach(obj => {
            let [name] = (obj.Name || "").split(",")
            if (!name) {
                return;
            }
            name = name.toLowerCase().trim();
            name.split("/").forEach(newName => {
                if (!cities[newName]) {
                    cities[newName] = obj.Code
                }
            })
        })
        return true
    }
        console.error("Failed to fetch cities for country - " + CountryCode + " . Response from server " + JSON.stringify(responseJson))
    } catch(e) {
        console.error("Failed to fetch cities. Error - " + e)
    }

    return false;
}

const refreshCities = async () => {
    const countryCodes = Object.values(countries);
    if (!countryCodes.length) {
        return;
    }

    const batchSize = 10;
    let currentBatch = []
    for (let i = 0; i < countryCodes.length; i++) {
        currentBatch.push(countryCodes[i])
        if (currentBatch.length === batchSize || i === countryCodes.length - 1) {
            const promises = currentBatch.map(refreshCityForACountry)
            currentBatch = []
            await Promise.all(promises);
            console.log(`Current batch processed. Processed Countries : ${i + 1} . Total Countries : ${countryCodes.length}`)
        }
    }
}

const refreshAirlineToken = async () => {
    console.log("Starting to refresh auth token")
    try {
        const responseObj = await fetch("http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "ClientId": "ApiIntegrationNew",
            "UserName": "Hackathon",
            "Password": process.env.AIRLINE_PASSWORD,
            "EndUserIp": "192.168.11.120"
        })
    })

    const response = await responseObj.json();
    if (response && response.TokenId) {
        airlineToken = response.TokenId;
        tokenRefreshTime = new Date()
    }
    } catch(e) {
        console.error("Error fetching auth token. Error " + e)
    }
    console.log("Auth token refreshed")
}

export const refreshData = async () => {
    const startTime = new Date().getTime();
    console.log("Starting to refresh all data");
    const tokenPromise = refreshAirlineToken()
    const loaded = await refreshCountries()
    if (loaded) {
        await refreshCities()
    }
    await tokenPromise
    console.log("Refresh data completed")
    console.log(`Time spent in refresh : ${new Date().getTime() - startTime}ms`)
}

export const getCityCode = (cityName) => {
    let normalized = cityName.toLowerCase().trim();
    normalized = normalized.replace(/[^a-zA-Z0-9 ]/g, "")
    if (cities[normalized]) {
        return cities[normalized];
    }

    for (let part of normalized.split(" ")) {
        if (cities[part]) {
            return cities[part]
        }
    }

    return null
}

export const getAccessToken = async () => {
    const currentTime = new Date();

    if (currentTime.getDate() !== tokenRefreshTime.getDate()) {
        await refreshAirlineToken()
    }

    if (!airlineToken) {
        await refreshAirlineToken();
    }

    return airlineToken
}