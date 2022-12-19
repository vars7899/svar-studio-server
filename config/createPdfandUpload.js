const moment = require("moment");
const cloudinary = require("cloudinary");
const generatePdf = require("./generateTicketPdfService");
const fs = require("fs");

const createPdfAndUpload = async (ticket) => {
  let _ticketData;
  // add more details to the ticket
  let time = moment(ticket?.movieDateAndTime).format("hh:mm A");
  let date = moment(ticket?.movieDateAndTime).format("MMMM Do YYYY");
  let hall = ticket.hall;
  let theatre = ticket.theatre.name;
  let movie = ticket.movie.title;
  let seats = ticket.seats;
  let _id = ticket._id;

  _ticketData = { theatre, movie, time, date, hall, seats, _id };
  // MICRO-SERVICE ------ generate pdf
  const pdfPath = await generatePdf(_ticketData);
  // upload pdf to the cloudinary
  const uploadedFile = await cloudinary.v2.uploader.upload(pdfPath, {
    folder: "movieApp",
  });
  // delete the file
  fs.rmSync("invoice.pdf");
  return uploadedFile;
};

module.exports = createPdfAndUpload;
