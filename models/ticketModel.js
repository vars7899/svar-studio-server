const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theatre",
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
    },
    movieDateAndTime: {
      type: Date,
      required: true,
    },
    seats: [{ type: String }],
    paymentDetails: {
      paymentDate: Date,
      paymentStatus: String,
      paymentAmount: Number,
      paymentReceipt: String,
      paymentId: String,
      cardLast4: Number,
      cardType: String,
      cardBrand: String,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model("ticket", TicketSchema);
module.exports = Ticket;
