const asyncHandler = require("express-async-handler");
const sendTicket = require("../config/sendTicket");
const Ticket = require("../models/ticketModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// <----------------- Stripe endpoints start ------------------>
const createStripePaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency, metadata } = req.body;
  console.log("done");
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
  });
  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
  });
});
const paymentUpdates = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (event.type === "charge.succeeded") {
    sendTicket(event.data.object);
  }
};
// <----------------- Stripe endpoints end ------------------>
const getUserTicket = asyncHandler(async (req, res) => {
  const ticketList = await Ticket.find({ user: req.user._id })
    .populate("movie")
    .populate({
      path: "theatre",
      select: "-movies",
    })
    .populate({
      path: "user",
      select: "-password -address",
    });
  res.status(200).json({
    success: true,
    message: `tickets successfully fetched`,
    ticketList,
  });
});

module.exports = { createStripePaymentIntent, paymentUpdates, getUserTicket };
