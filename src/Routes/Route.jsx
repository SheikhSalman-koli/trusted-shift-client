import { createBrowserRouter } from "react-router";
import RootLayOut from "../Layout/RootLayOut";
import Home from "../Pages/Home";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayOut,
        children: [
            {
                index: true,
                Component: Home
            },

            
        ]
    }
])