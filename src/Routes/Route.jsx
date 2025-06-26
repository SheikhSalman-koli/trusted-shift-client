import { createBrowserRouter } from "react-router";
import RootLayOut from "../Layout/RootLayOut";
import Home from "../Pages/Home";
import AuthLayOut from "../Layout/AuthLayOut";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "./PrivateRoute";
import AddParcel from "../Pages/SendParcel/AddParcel";
import DashBoardLayout from "../Layout/DashBoardLayout";
import MyParcel from "../Pages/Dashborad/MyParcel/MyParcel";
import Payment from "../Pages/Dashborad/Patment/Payment";

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
                loader: ()=> fetch('/warehouses.json'),
                // Component: Coverage,
                element: <PrivateRoute>
                    <Coverage></Coverage>
                </PrivateRoute>
            },
            {
                path: 'sendparcel',
                loader: ()=> fetch('/warehouses.json'),
                element: <PrivateRoute>
                    <AddParcel></AddParcel>
                </PrivateRoute>
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
    },
    {
        path: 'dashboard',
        element: <PrivateRoute>
            <DashBoardLayout></DashBoardLayout>
        </PrivateRoute>,
        children: [
            {
                path: 'myparcel',
                Component: MyParcel
            },
            {
                path: 'payment/:parcelId',
                Component: Payment
            }
        ]
    }
])