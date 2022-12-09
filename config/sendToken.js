async function sendToken(res, user, statusCode, message) {
  const token = await user.generateToken();
  const userData = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    image: user.image,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    address: user.address,
  };
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_GAP * 24 * 60 * 60 * 1000
    ),
  };
  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    user: userData,
  });
}

module.exports = sendToken;
