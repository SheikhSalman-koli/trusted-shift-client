import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import UseAxiosSecure from '../../../Context/Hook/UseAxiosSecure';
import UseAuth from '../../../Context/Hook/UseAuth';

const PaymentForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const [error, setError] = useState('')
    const { parcelId } = useParams()
    // console.log(parcelId);
    const {user} = UseAuth()
    const axiosSecure = UseAxiosSecure()

    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure(`/parcels/${parcelId}`)
            return res.data
        }
    })

    console.log(parcelInfo);
    if (isPending) {
        return <span className="loading loading-dots loading-xl"></span>
    }

    const price = parcelInfo.deliveryCost;
    const priceInCents = price * 100;

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        if (!stripe || !elements) {
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement)

        if (!card) {
            return;
        }

        // Use your card Element with other Stripe.js APIs

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            setError(error.message)
            // console.log(error);
        } else {
            setError('')
            console.log('payment method', paymentMethod);

            const res = await axiosSecure.post('/create-payment-intent', {
                priceInCents,
                parcelId
            })

            const clientSecret = res.data.clientSecret

            // step-3: confirm message
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                setError('')
                if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded');
                console.log(result);
                // step-4: mark parcel paid also create payment history
            }
        }

        }



    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-4 bg-white rounded shadow space-y-4 mt-5">
            <CardElement className='p2 border rounded'>
            </CardElement>

            <button
                className="btn btn-primary text-black w-full"
                type='submit'
                disabled={!stripe}
            >
                pay ৳:{price}
            </button>
            {
                error && <p className='text-red-500'>{error}</p>
            }
        </form>
    );
};

export default PaymentForm;