const { getUserTicket } = require("../controllers/ticketController");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/").get(auth, getUserTicket);

module.exports = router;
