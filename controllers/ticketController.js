const asyncHandler = require("express-async-handler");
const generatePdf = require("../config/generateTicketPdfService");
const sendTicket = require("../config/sendTicket");
const Ticket = require("../models/ticketModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const moment = require("moment");
const cloudinary = require("cloudinary");
const fs = require("fs");
const createPdfAndUpload = require("../config/createPdfandUpload");

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

const testGeneratePdf = asyncHandler(async (req, res) => {
  // let ticket = {
  //   _id: "6392567d4b328acda0839804",
  //   theatre: {
  //     name: "Cineplex Strawberry hills",
  //   },
  //   movie: {
  //     title: "Jai Bhim",
  //   },
  //   movieDateAndTime: "1970-01-19T03:26:02.058Z",
  //   seats: ["A1", "A2", "A3", "A4", "A5"],
  // };
  // // extra data
  // let time = moment(ticket.movieDateAndTime).format("hh:mm A");
  // let date = moment(ticket.movieDateAndTime).format("MMMM Do YYYY");
  // let hall = (Math.random() * 12 + 1).toFixed(0);
  // ticket = { ...ticket, time, date, hall };
  // const pdfPath = await generatePdf(ticket);

  // // upload pdf to the cloudinary
  // await cloudinary.v2.uploader.upload(pdfPath, {
  //   folder: "movieApp",
  // });
  // // delete the file
  // fs.rmSync("invoice.pdf");
  // res.status(200).json({
  //   success: true,
  //   message: "file uploaded",
  // });
  const payment = {
    id: "ch_3MGTz6KsIiGRFWah0wfCMHgK",
    object: "charge",
    livemode: false,
    payment_intent: "pi_3MGTz6KsIiGRFWah0T5Cdmix",
    status: "succeeded",
    amount: 3565,
    amount_captured: 3565,
    amount_refunded: 0,
    application: null,
    application_fee: null,
    application_fee_amount: null,
    balance_transaction: "txn_3MGTz6KsIiGRFWah0X8wQP3A",
    billing_details: {
      address: {
        city: null,
        country: "US",
        line1: null,
        line2: null,
        postal_code: "55855",
        state: null,
      },
      email: null,
      name: null,
      phone: null,
    },
    calculated_statement_descriptor: "Stripe",
    captured: true,
    created: 1671397352,
    currency: "cad",
    customer: null,
    description: null,
    destination: null,
    dispute: null,
    disputed: false,
    failure_balance_transaction: null,
    failure_code: null,
    failure_message: null,
    fraud_details: {},
    invoice: null,
    metadata: {
      hall: "8",
      movieId: "63914e6ceab81ed6c0cde4fa",
      seats: "4G, 5G, 6G, 7G",
      theatreId: "639160dcdcf51848245b9aef",
      movieDateAndTime: "1672202160",
      userId: "63903cb461342d78a860fab3",
    },
    on_behalf_of: null,
    order: null,
    outcome: {
      network_status: "approved_by_network",
      reason: null,
      risk_level: "normal",
      risk_score: 31,
      seller_message: "Payment complete.",
      type: "authorized",
    },
    paid: true,
    payment_method: "pm_1MGU0BKsIiGRFWahIALZQ7Ms",
    payment_method_details: {
      card: {
        brand: "visa",
        checks: {
          address_line1_check: null,
          address_postal_code_check: "pass",
          cvc_check: "pass",
        },
        country: "US",
        exp_month: 2,
        exp_year: 2023,
        fingerprint: "IHCc8bw44hJYPGZa",
        funding: "credit",
        installments: null,
        last4: "4242",
        mandate: null,
        network: "visa",
        three_d_secure: null,
        wallet: null,
      },
      type: "card",
    },
    receipt_email: null,
    receipt_number: null,
    receipt_url:
      "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTUNkY0dLc0lpR1JGV2FoKOn__ZwGMgY8M81gjzs6LBZYriVDG0P8n6WVz8PKHdoDGSpBf249WD2-6TAoHmwZASYHgjbaiQy1wmRt",
    refunded: false,
    review: null,
    shipping: null,
    source: null,
    source_transfer: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    transfer_data: null,
    transfer_group: null,
  };
  const _response = await sendTicket(payment);
  // const _response = createPdfAndUpload(ticket);
  res.json(_response);
});

module.exports = {
  createStripePaymentIntent,
  paymentUpdates,
  getUserTicket,
  testGeneratePdf,
};
