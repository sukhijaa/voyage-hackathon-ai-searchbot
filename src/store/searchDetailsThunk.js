import { setFinalizedComponents, setSearchError, setSearchLoading, setSearchOutput } from "./chatbotReducer";

export const handleDataSearch =
  (finalComponents) => async (dispatch, getState) => {
    if (Object.keys(finalComponents).length === 0) {
      return;
    }
    dispatch(setFinalizedComponents(finalComponents));
    dispatch(setSearchOutput({}));
    dispatch(setSearchLoading(true))

    let baseURL = "";
    console.log(process.env)
    if (process.env.NODE_ENV === "development") {
        baseURL = "http://localhost:8000"
    }

    try {
        const responseObj = await fetch(baseURL + "/api/fetchSearchResults", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(finalComponents),
          });

          if (responseObj.status !== 200) {
            throw new Error("API returned status code other than 200");
          }
          const responseData = await responseObj.json();
          dispatch(setSearchOutput(responseData));
          dispatch(setSearchError(""))
    } catch(e) {
        console.error("Error fetching search results. Error : " + e)
        dispatch(setSearchError("Failed to fetch itinerary. Please try again"))
    } finally {
        dispatch(setSearchLoading(false))
    }
  };
