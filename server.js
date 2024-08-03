import express from 'express';
import dotenv from 'dotenv';
import stripe from 'stripe';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.get('/success', (req, res) => {
    res.sendFile('success.html', { root: 'public' });
});

app.get('/cancel', (req, res) => {
    res.sendFile('cancel.html', { root: 'public' });
});

// Stripe setup
const stripeGateway = stripe(process.env.STRIPE_API_KEY);
const DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async (req, res) => {
    try {
        const lineItems = req.body.items.map((item) => {
            const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '')) * 100;
            console.log("item-price:", item.price);
            console.log("unitAmount:", unitAmount);
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                        images: [item.productImg]
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });
        console.log("lineItems:", lineItems);

        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${DOMAIN}/success`,
            cancel_url: `${DOMAIN}/cancel`,
            line_items: lineItems,
            billing_address_collection: 'required',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
