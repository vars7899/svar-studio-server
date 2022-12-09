const {
  getAllTheatre,
  getAllUserTheatre,
} = require("../controllers/theatreController");
const isAdmin = require("../middleware/adminMiddleware");
const { auth } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.route("/").get(auth, getAllTheatre);
router.route("/admin/theatre-list", auth, isAdmin, getAllUserTheatre);

module.exports = router;
