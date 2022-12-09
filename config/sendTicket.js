const sendEmailToClient = require("../middleware/sendEmail");
const Ticket = require("../models/ticketModel");
const User = require("../models/userModel");

async function sendTicket(payment) {
  const { last4, network, funding } = payment.payment_method_details;
  const { movieId, hall, seats, theatreId, userId, ticketDate } =
    payment.metadata;
  const { amount, receipt_url, paid, created, id } = payment;
  try {
    // create a new ticket in db
    const ticket = await Ticket.create({
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
    const userDetails = await User.findById(userId);
    if (userDetails) {
      sendEmailToClient(
        "The Svar Studio",
        "verfication@svar.com",
        userDetails.email,
        "Verify your svar studio account",
        `
        <div>
        ${receipt_url}
        </div>
        `
      );
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = sendTicket;
