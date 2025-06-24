import React, { use, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEyeSlash } from 'react-icons/fa';
import { MdRemoveRedEye } from 'react-icons/md';
import { AuthContext } from '../../../Context/AuthContext';
import SocialLogin from '../SocialLogin';
import { Link } from 'react-router';


const Login = () => {

    // const {test} = use(AuthContext)
    // console.log(test);

    const { 
        register,
         handleSubmit,
         formState:{errors}
        } = useForm()

    const [showPAssword, setShowPassword] = useState(false)

    const data = info => {
        console.log(info);
    }

    const handleShowPassword = () => {
        setShowPassword(!showPAssword)
    }

    return (
        <div>
            <form onSubmit={handleSubmit(data)}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
             <h1 className="text-3xl font-bold">Login Now!</h1>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className="input"
                        placeholder="Email" 
                        />

                    <label className="label">Password</label>
                    <input
                        type={showPAssword ? "text" : "password"}
                        {...register('password', {required: true, minLength: 6})}
                        className="input"
                        placeholder="Password" 
                        />
                        {
                            errors.password?.type === 'required' && 
                            <p
                            className='text-red-500'
                            >you have to set a password</p>
                        }
                        {
                            errors.password?.type === 'minLength' && 
                            <p
                            className='text-red-500'
                            >
                            password must have 6 charectes</p>
                        }

                    <span onClick={handleShowPassword} className=''>
                        {showPAssword ? <FaEyeSlash size={20} /> : <MdRemoveRedEye size={20} />}
                    </span>


                    <button type='submit' className="btn btn-primary text-black mt-4">Login</button>
                <p>New in this site? 
                    <Link className='btn btn-link' to='/register'>Create Account</Link>
                </p>
                </fieldset>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Login;