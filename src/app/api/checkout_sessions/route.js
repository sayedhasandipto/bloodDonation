import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')
        
        const body = await req.json();
        const { amount, name, email } = body;

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Blood Donation Fund Contribution',
                        },
                        unit_amount: amount * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/funding/success?session_id={CHECKOUT_SESSION_ID}&amount=${amount}`,
            cancel_url: `${origin}/funding`,
            customer_email: email,
        });
        
        return NextResponse.json({ url: session.url });
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}