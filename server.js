const express = require("express");
require("dotenv").config();
require("./config/connectDB");
require("colors");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const errorHandler = require("./middleware/errorMiddleware");
const userRouter = require("./routes/userRoutes");
const theatreRouter = require("./routes/theatreRoutes");
const adminRouter = require("./routes/adminRoutes");
const movieRouter = require("./routes/movieRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const cookieParser = require("cookie-parser");
const {
  createStripePaymentIntent,
  paymentUpdates,
} = require("./controllers/ticketController");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8080;
const BASE = "/api/v1";

// send raw data to stripe endpoint
app.use("/stripe", express.raw({ type: "*/*" }));
// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    limits: {
      fileSize: 50 * 1024 * 1024, // 50mb file
    },
    useTempFiles: true,
  })
);

// routes

app.get(`/`, (req, res) => {
  res.status(200).json({
    success: true,
  });
});
app.use(`${BASE}/user`, userRouter);
app.use(`${BASE}/theatre`, theatreRouter);
app.use(`${BASE}/movie`, movieRouter);
app.use(`${BASE}/admin`, adminRouter);
app.use(`${BASE}/ticket`, ticketRouter);
// stripe
app.post(`${BASE}/create-payment-intent`, createStripePaymentIntent);
app.post("/stripe", paymentUpdates);

// error middleware
app.use(errorHandler);

// start
app.listen(PORT, () => {
  console.log(
    `\nServer is Up running on PORT: ${PORT}`.green,
    `\nVisit http://localhost:8080/api/v1`.blue.underline
  );
});
