const router = require("express").Router();
const {
  registerUser,
  verifyUser,
  loginUser,
  logoutUser,
  sendForgotPasswordEmail,
  resetPassword,
  updatePassword,
  updateUserDetails,
  profileDetails,
} = require("../controllers/userController");
const { auth } = require("../middleware/authMiddleware");

router.route("/").post(loginUser).get(auth, profileDetails);
router.route("/register").post(registerUser);
router.route("/verify").post(auth, verifyUser);
router.route("/logout").get(auth, logoutUser);
router.route("/send-forgot-password-link").post(sendForgotPasswordEmail);
router.route("/reset-password/:token").post(resetPassword);
router.route("/update-password").post(auth, updatePassword);
router.route("/update-details").post(auth, updateUserDetails);

module.exports = router;
