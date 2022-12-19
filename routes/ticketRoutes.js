const {
  getUserTicket,
  testGeneratePdf,
} = require("../controllers/ticketController");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/").get(auth, getUserTicket);
router.route("/pdf").get(auth, testGeneratePdf);

module.exports = router;
