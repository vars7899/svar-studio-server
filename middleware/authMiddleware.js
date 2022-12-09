const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function auth(req, res, next) {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user, no token",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userExist = await User.findById(decoded._id);
    if (!userExist) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user, Invalid token",
      });
    }
    req.user = userExist;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Server was not able to process request",
      err,
    });
  }
}

module.exports = { auth };
