import App from "./pages/LandingPage.js";
import {createBrowserRouter} from "react-router-dom"
import SearchPage from "./pages/SearchPage.js";
import TeamDetails from "./pages/TeamDetails.js";
import FaqPage from "./pages/FaqPage.js";

const routes = [
    {
        path: "/",
        element: <App/>,
        errorElement: <App/>
    },
    {
        path: "/search",
        exact: true,
        element: <SearchPage/>
    },
    {
        path: "/faq",
        exact: true,
        element: <FaqPage/>
    },
    {
        path: "/team",
        exact: true,
        element: <TeamDetails/>
    }
]

export default createBrowserRouter(routes)