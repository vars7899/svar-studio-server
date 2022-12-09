const {
  createNewMovie,
  deleteMovieById,
  updateMovieDetails,
  getMovieById,
} = require("../controllers/movieController");
const {
  addNewTheatre,
  removeTheatre,
  updateTheatreDetails,
  getTheatreById,
  addMovieToTheatre,
  deleteMovieFromTheatre,
} = require("../controllers/theatreController");
const isAdmin = require("../middleware/adminMiddleware");
const { auth } = require("../middleware/authMiddleware");
const router = require("express").Router();

// admin routes for theatre
router.route("/theatre/add").post(auth, isAdmin, addNewTheatre);
router.route("/theatre/movie/add").post(auth, isAdmin, addMovieToTheatre);
router
  .route("/theatre/movie/remove")
  .patch(auth, isAdmin, deleteMovieFromTheatre);
router
  .route("/theatre/:theatreId")
  .delete(auth, isAdmin, removeTheatre)
  .patch(auth, isAdmin, updateTheatreDetails)
  .get(auth, isAdmin, getTheatreById);
// admin routes for users

// admin routes for movies
router.route("/movie/add").post(auth, isAdmin, createNewMovie);
router
  .route("/movie/:movieId")
  .delete(auth, isAdmin, deleteMovieById)
  .patch(auth, isAdmin, updateMovieDetails)
  .get(auth, isAdmin, getMovieById);
// admin routes for tickets

module.exports = router;
