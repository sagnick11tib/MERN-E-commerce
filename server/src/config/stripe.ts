import dotenv from "dotenv"
dotenv.config();
import Stripe from "stripe";
const stripeKey = process.env.STRIPE_SECRET_KEY || "" ;
console.log(stripeKey)
export const stripe = new Stripe(stripeKey);