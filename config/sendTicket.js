const sendEmailToClient = require("../middleware/sendEmail");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");
const createPdfAndUpload = require("./createPdfandUpload");

async function sendTicket(payment) {
  let { last4, network, funding } = payment.payment_method_details;
  let { movieId, hall, seats, theatreId, userId, ticketDate } =
    payment.metadata;
  let { amount, receipt_url, paid, created, id } = payment;
  // convert the seat back to an array
  seats = seats.split(",");
  try {
    // create a new ticket in db
    let ticket = await Ticket.create({
      user: userId,
      theatre: theatreId,
      movie: movieId,
      seats: seats,
      hall: hall,
      movieDateAndTime: ticketDate,
      paymentDetails: {
        paymentDate: created,
        paymentStatus: paid,
        paymentAmount: amount,
        paymentReceipt: receipt_url,
        paymentId: id,
        cardLast4: last4,
        cardType: funding,
        cardBrand: network,
      },
    });
    // populate the ticket with whole data
    let populatedTicket = await Ticket.findById(ticket._id)
      .populate({ path: "movie", select: "title" })
      .populate({
        path: "theatre",
        select: "-movies -address name",
      })
      .select("-paymentDetails");

    // create and upload ticket pdf
    const _pdfTicket = await createPdfAndUpload(populatedTicket);
    const userDetails = await User.findById(userId);
    if (userDetails) {
      sendEmailToClient(
        "The Svar Studio",
        "ticket@svar.com",
        userDetails.email,
        `Congratulation, Grab your ticket`,
        `
        <div>
          <div>${receipt_url}</div>
          <div>${_pdfTicket.url}</div>
        </div>
        `
      );
    }
    return {
      success: true,
      message: "PDF ticket generated and uploaded successfully",
      ticket: _pdfTicket.url,
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendTicket;
