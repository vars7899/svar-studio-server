const asyncHandler = require("express-async-handler");
const sendToken = require("../config/sendToken");
const sendEmailToClient = require("../middleware/sendEmail");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");
const forgotPasswordTemplate = require("../templates/forgotPasswordTemplate");
const verificationHtml = require("../templates/verificationTemplate");
const validateEmail = require("../utils/validateEmail");
const crypto = require("crypto");
const fs = require("fs");
const Address = require("../models/addressModel");
const cloudinary = require("cloudinary");
const OTP_MAX = 999999;
const OTP_MIN = 100000;

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, cfPassword } = req.body;
  const image = req.files.image.tempFilePath;

  // check and validate required field
  if (!fullName || !email || !password || !cfPassword) {
    res.status(400);
    throw new Error("Missing one or more required field(s)");
  }
  if (password !== cfPassword) {
    res.status(400);
    throw new Error("Password does not match");
  }
  if (!validateEmail(email)) {
    res.status(400);
    throw new Error("Invalid email syntax");
  }

  // check if email already exist
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    res.status(400);
    throw new Error("Email already registered");
  }
  // generate a otp number to verify email
  const otpValue = Number.parseInt(
    Math.floor(Math.random() * (OTP_MAX - OTP_MIN)) + OTP_MIN
  );

  // register new user, create address, upload image
  const cloudImage = await cloudinary.v2.uploader.upload(image, {
    folder: "movieApp",
  });
  // delete tmp folder
  fs.rmSync("./tmp", { recursive: true });

  const address = await Address.create({});
  const newUser = await User.create({
    fullName,
    email,
    password,
    address: address._id,
    otp: {
      value: otpValue,
      expiresAt: new Date(Date.now() + process.env.OTP_EXPIRE_GAP * 60 * 1000),
    },
    image: {
      public_id: cloudImage.public_id,
      url: cloudImage.secure_url,
    },
  });
  if (newUser) {
    // send response
    sendToken(
      res,
      newUser,
      201,
      "User registered successfully, An OTP was sent to the provided email, please verify to continue"
    );
    // send OTP email to the client
    const mailHtml = verificationHtml(otpValue);
    sendEmailToClient(
      "The Svar Studio",
      "verfication@svar.com",
      email,
      "Verify your svar studio account",
      mailHtml
    );
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const otp = Number(req.body.otp);

  const userExist = await User.findById(req.user._id);

  if (!userExist) {
    res.status(401);
    throw new Error("UnAuthorized user");
  }

  // check for otp and otp expiry
  if (userExist.otp.value !== otp || userExist.otp.expiresAt < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  // update user if found
  userExist.otp.value = null;
  userExist.otp.expiresAt = null;
  userExist.isVerified = true;
  await userExist.save();

  // send response
  sendToken(res, userExist, 200, "User verified successfully");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check for required fields
  if (!email || !password) {
    res.status(400);
    throw new Error("Missing one or more required fields");
  }

  // find the user from email and check password
  const userExist = await User.findOne({ email });

  if (!userExist || !(await userExist.matchPassword(password))) {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }

  sendToken(res, userExist, 200, "User logged In successfully");
});

const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User logged Out successfully",
    });
});

const sendForgotPasswordEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // look for required fields
  if (!email) {
    res.status(400);
    throw new Error("Email is required field");
  }

  const userExist = await User.findOne({ email });

  // create and hash token to store in the db
  const resetToken = crypto.randomBytes(32).toString("hex") + userExist._id;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // first delete the token for user if already exist
  const tokenExist = await Token.findOne({ user: userExist._id });
  if (tokenExist) {
    await tokenExist.deleteOne();
  }
  // Create new Token for reset link
  const token = await Token.create({
    user: userExist._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000,
  });

  if (userExist && token) {
    const mailHtml = forgotPasswordTemplate(
      userExist.email,
      `${process.env.CLIENT_ADDRESS}/reset-password/${resetToken}`
    );
    sendEmailToClient(
      "The Svar Studio",
      "reset-password@svar.com",
      email,
      "Reset password",
      mailHtml
    );
  }
  if (token) {
    res.status(200).json({
      success: true,
      message: "Link to reset password will be sent to the provided email",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, newCfPassword } = req.body;
  const { token } = req.params;

  // check for required fields
  if (!newPassword || !newCfPassword) {
    res.status(400);
    throw new Error("Missing required field");
  }
  // check password match
  if (newPassword !== newCfPassword) {
    res.status(400);
    throw new Error("New given password does not match");
  }

  // un hash token and compare
  const unHashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // find token in the db
  const userToken = await Token.findOne({
    token: unHashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or expired Token");
  }

  // find user and update user password
  const userExist = await User.findById(userToken.user);
  userExist.password = newPassword;
  await userExist.save();

  sendToken(
    res,
    userExist,
    200,
    "Password reset successfully, please Sign in with new credentials"
  );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, newCfPassword } = req.body;

  if (!oldPassword || !newPassword || !newCfPassword) {
    res.status(400);
    throw new Error("Missing one or more required field(s)");
  }
  if (newCfPassword !== newPassword) {
    res.status(400);
    throw new Error("New password does not match");
  }

  const userExist = await User.findById(req.user._id);

  if (!userExist.matchPassword(oldPassword)) {
    res.status(400);
    throw new Error("Provided current password does not match our records");
  }

  userExist.password = newPassword;
  await userExist.save();

  sendToken(res, userExist, 200, "User password updated successfully");
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, address } = req.body;
  const image = req.files?.image.tempFilePath;

  const userExist = await User.findById(req.user._id);

  if (!userExist) {
    res.status(400);
    throw new Error("User does not exist, please try again");
  }

  let updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { fullName },
    { new: true }
  );

  // destroy older image and upload new image
  if (req.files) {
    await cloudinary.v2.uploader.destroy(userExist.image.public_id);

    var cloudImage = await cloudinary.v2.uploader.upload(image, {
      folder: "movieApp",
    });
    fs.rmSync("./tmp", { recursive: true });

    updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        image: {
          public_id: cloudImage.public_id,
          url: cloudImage.secure_url,
        },
      },
      { new: true }
    );
  }

  if (address) {
    const { street, city, state, country, postalCode, lat, lng } = address;

    // update address
    await Address.findByIdAndUpdate(
      updatedUser.address,
      { street, city, state, country, postalCode, lat, lng },
      { new: true }
    );
  }

  const userDetails = await User.findById(updatedUser._id);

  if (updatedUser) {
    sendToken(res, userDetails, 200, "User Details updated successfully");
  }
});

const profileDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  sendToken(res, user, 200, "");
});

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  sendForgotPasswordEmail,
  resetPassword,
  updatePassword,
  updateUserDetails,
  profileDetails,
};
