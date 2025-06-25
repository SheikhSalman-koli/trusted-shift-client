import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../Components/firebase/firebase_init';

const provider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({})
    console.log(user);

    const createUser = (email,password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const updateUser =(updated)=>{
        return updateProfile(auth.currentUser ,updated)
    }

    const signInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

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

   

    const AuthInfo = {
        signInWithGoogle,
        logout,
        user,
        createUser,
        updateUser,
        signInUser
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