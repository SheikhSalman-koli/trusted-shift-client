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
import Histiry from "../Pages/Dashborad/PaymentHistory/Histiry";
import BeARider from "../Pages/BeRider.jsx/BeARider";
import PendingRider from "../Pages/Dashborad/Pending/PendingRider";
import ActiveRiders from "../Pages/Dashborad/Actives/ActiveRiders";

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
            },
            {
                path: 'berider',
                loader: ()=> fetch('/warehouses.json'),
                element: <PrivateRoute>
                    <BeARider></BeARider>
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
            },
            {
                path: 'history',
                Component: Histiry
            },
            {
                path:'pendingrider',
                Component: PendingRider
            },
            {
                path: 'activerider',
                Component: ActiveRiders
            }
        ]
    }
])