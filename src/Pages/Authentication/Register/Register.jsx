import React, { use } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import UseAuth from '../../../Context/Hook/UseAuth';
import Swal from 'sweetalert2';

const Register = () => {
    const { createUser, updateUser } = UseAuth()

    const location = useLocation()
    const navigate = useNavigate()
    const from = location.state || '/'

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = info => {
        const email = info.email
        const password = info.password
        const name = info.name
        const photo = info.photo

        createUser(email, password)
            .then(result => {
                const emailHolder = result.user
                updateUser({ ...emailHolder, displayName: name, photoURL: photo })
                    .then(() => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        })
                        navigate(from)
                    }).catch(error => {
                        console.log(error);
                    })
                // console.log(emailHolder);
            }).catch(error => {
                console.log(error);
            })

    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <h1 className="text-3xl font-bold">Create An Account!</h1>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: true, })}
                        className="input"
                        placeholder="Email" />
                    {
                        errors.email?.type === 'required' &&
                        <p role='alart' className='text-red-500'>fill the input field</p>
                    }

                    <label className="label">Password</label>
                    <input
                        type="password"
                        {...register('password', { pattern: /^(?=.*[a-z])(?=.*[A-Z])/, minLength: 6 })}
                        className="input"
                        placeholder="Password" />
                    {
                        errors.password?.type === 'pattern' &&
                        <p role='alart' className='text-red-500'>enter correct password</p>
                    }
                    {
                        errors.password?.type === 'minLength' &&
                        <p role='alart' className='text-red-500'>Length minimum 6 characters</p>
                    }

                    <label className='label'>Name</label>
                    <input
                        {...register('name')}
                        type="text"
                        className='input'
                        placeholder='Name' />

                    <label className='label'>Photo</label>
                    <input
                        {...register('photo')}
                        type="text"
                        className='input'
                        placeholder='Photo_url' />

                    <button type='submit' className="btn btn-primary text-black mt-4">Register</button>

                    <p>Already have an account?
                        <Link className='btn btn-link' to='/login'>Login</Link>
                    </p>
                </fieldset>
            </form>
        </div>
    );
};

export default Register;