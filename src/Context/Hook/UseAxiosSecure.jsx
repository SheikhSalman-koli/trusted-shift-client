import axios from 'axios';
import React, { useEffect } from 'react';
import UseAuth from './UseAuth';


const axiosSecure = axios.create({
    baseURL: `http://localhost:5000`
})

const UseAxiosSecure = () => {
    const { user } = UseAuth()
    // console.log(user?.accessToken);




    useEffect(() => {
        if (user) {
            axiosSecure.interceptors.request.use((config) => {
                //   console.log(user?.accessToken);
                config.headers.Authorization = `Bearer ${user?.accessToken}`
                return config
            }, error => {
                return Promise.reject(error)
            })
        }
    }, [user])

    return axiosSecure
};


export default UseAxiosSecure;