import React from 'react';
import UseAuth from '../Context/Hook/UseAuth';
import { Navigate } from 'react-router';

const PrivateRoute = ({children}) => {

    const {user} = UseAuth()

    if(!user){
        return <Navigate to='/login'></Navigate>
    }
  
    return children
};

export default PrivateRoute;