const { getAllMovie, getMovieById } = require("../controllers/movieController");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/").get(auth, getAllMovie);
router.route("/:movieId").get(auth, getMovieById);

module.exports = router;
