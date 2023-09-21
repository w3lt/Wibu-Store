const express = require('express');
const { STRIPE_SECRET_KEY, PORT } = require('./configs');

import { Stripe } from 'stripe';
const stripe = new Stripe(STRIPE_SECRET_KEY);

const app = express();

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})