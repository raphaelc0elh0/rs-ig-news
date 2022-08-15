import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2022-08-01"
})

// const getPrice = async () => {
//   const price = await stripe.prices.retrieve("price_1LXBnKCQs03RhosuyNAr5YMB", {
//     expand: ["product"]
//   })
//   console.log(price)
// }

// getPrice()
