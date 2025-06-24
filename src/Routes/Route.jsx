import { createBrowserRouter } from "react-router";
import RootLayOut from "../Layout/RootLayOut";
import Home from "../Pages/Home";
import AuthLayOut from "../Layout/AuthLayOut";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayOut,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: 'coverage',
                Component: Coverage,
                loader: ()=> fetch('/warehouses.json')
            }
            
        ]
    },
    {
        path: '/',
        Component: AuthLayOut,
        children: [
            {
                path: 'login',
                Component: Login
            },
            {
                path: 'register',
                Component: Register
            }
        ]
    }
])