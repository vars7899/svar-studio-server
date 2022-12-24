const {
  getAllMovie,
  getMovieById,
  searchMovieByKeyword,
  searchMovieByGenre,
} = require("../controllers/movieController");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/").get(auth, getAllMovie);
router.route("/query").get(auth, searchMovieByKeyword);
router.route("/genre").get(auth, searchMovieByGenre);
router.route("/:movieId").get(auth, getMovieById);

module.exports = router;
