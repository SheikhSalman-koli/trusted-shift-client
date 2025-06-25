import React from 'react';
import UseAuth from '../Context/Hook/UseAuth';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {

    const {user} = UseAuth()

    const location = useLocation()
    // console.log(location);

    if(!user){
        return <Navigate state={location.pathname} to='/login'></Navigate>
    }
  
    return children
};

export default PrivateRoute;