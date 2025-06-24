import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../Components/firebase/firebase_init';

const provider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({})
    console.log(user);


    const signInWithGoogle = () => {
        return signInWithPopup(auth, provider)
    }

    const logout =()=>{
        return signOut(auth)
    }


    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser)
        })
        return ()=> {
            unSubscribe()
        }
    },[])

    const test = 'is okokoko?'

    const AuthInfo = {
        signInWithGoogle,
        logout,
        user,
        test
    }

    return (
        <div>
            <AuthContext value={AuthInfo}>
                {children}
            </AuthContext>
        </div>
    );
};

export default AuthProvider;