import React, { useEffect, useState } from "react";
import {
    CardElement,
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { execRequest } from "../../support";

import "./Checkout.css";

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();



    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                payment_method_data: {
                    billing_details: {
                        address: {
                            country: "FR"
                        }
                    }
                },
                return_url: window.location.href,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: {
            type: "accordion",
            radios: true
        },
        fields: {
            billingDetails: {
                address: {
                    country: 'never',
                }
            }
        }
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="pay-now">
                Pay now
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}



// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51NsNMwJqOqW5UsDeY4l4UeBtEMW1Cz7fUnr5Uk0FloPFFGKAmWs7x3OYeQciF55V3qUzfnICFxQOmWlrh1g21QWx00R8Mc5pHQ");

export default function Checkout({ gameIDs }) {
    
    // const [orderSummary, setOrderSummary] = useState([]);

    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        (async () => {
            // Create PaymentIntent as soon as the page loads
            const response = await execRequest("/create-payment-intent", "POST", {itemIDs: gameIDs});
            if (response.id === 0) {
                setClientSecret(response.data.clientSecret);
            } else {
                console.log(response.msg);
            }
        }) ();
    }, []);

    const appearance = {
        theme: 'stripe',
        labels: 'floating',
        variables: { colorPrimaryText: '#262626' }
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="checkout">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    );
}