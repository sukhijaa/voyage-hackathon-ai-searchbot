import { setFinalizedComponents, setSearchOutput } from "./chatbotReducer";

export const handleDataSearch =
  (finalComponents) => async (dispatch, getState) => {
    if (Object.keys(finalComponents).length === 0) {
      return;
    }
    dispatch(setFinalizedComponents(finalComponents));
    dispatch(setSearchOutput({}));

    let baseURL = "";
    console.log(process.env)
    if (process.env.NODE_ENV === "development") {
        baseURL = "http://localhost:8000"
    }

    const responseObj = await fetch(baseURL + "/api/fetchSearchResults", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalComponents),
    });

    const responseData = await responseObj.json();
    dispatch(setSearchOutput(responseData));
  };
