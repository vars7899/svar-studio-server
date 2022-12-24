const asyncHandler = require("express-async-handler");
const sendMovieList = require("../config/sendMovieList");
const Movie = require("../models/movieModel");

const getAllMovie = asyncHandler(async (req, res) => {
  const movieList = await Movie.find({});
  sendMovieList(res, movieList, 200);
});
const getMovieById = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  // find the movie details from the provided id
  const movieExist = await Movie.findOne({ _id: movieId });
  if (!movieExist) {
    res.status(400);
    throw new Error(
      "Invalid Movie ID, movie with provided ID does not exist, please try again"
    );
  }
  res.status(200).json({
    success: true,
    message: `${movieExist.title} fetched successfully`,
    movie: movieExist,
  });
});
const updateMovieDetails = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const {
    adult,
    backdropPath,
    genres,
    originalLanguage,
    originalTitle,
    overview,
    popularity,
    posterPath,
    releaseDate,
    title,
    video,
    voteAverage,
    voteCount,
    isTrending,
    isNowPlaying,
  } = req.body;

  // find the movie details from the provided id
  const movieExist = await Movie.findOne({ _id: movieId });
  if (!movieExist) {
    res.status(400);
    throw new Error(
      "Invalid Movie ID, movie with provided ID does not exist, please try again"
    );
  }
  const updatedMovie = await Movie.findByIdAndUpdate(
    movieId,
    {
      adult,
      backdropPath,
      genres,
      originalLanguage,
      originalTitle,
      overview,
      popularity,
      posterPath,
      releaseDate,
      title,
      video,
      voteAverage,
      voteCount,
      isTrending,
      isNowPlaying,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `${movieExist.title} updated successfully`,
    movie: updatedMovie,
  });
});
const deleteMovieById = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  // find the movie details from the provided id
  const movieExist = await Movie.findOne({ _id: movieId });
  if (!movieExist) {
    res.status(400);
    throw new Error(
      "Invalid Movie ID, movie with provided ID does not exist, please try again"
    );
  }
  await Movie.findByIdAndDelete(movieId);
  res.status(200).json({
    success: true,
    message: `${movieExist.title} deleted successfully`,
  });
});
const createNewMovie = asyncHandler(async (req, res) => {
  const {
    adult,
    backdropPath,
    genres,
    originalLanguage,
    originalTitle,
    overview,
    popularity,
    posterPath,
    releaseDate,
    title,
    video,
    voteAverage,
    voteCount,
    isTrending,
    isNowPlaying,
    tmdbId,
  } = req.body;

  // look for required fields
  if (
    !backdropPath ||
    !genres ||
    !originalLanguage ||
    !originalTitle ||
    !overview ||
    !popularity ||
    !posterPath ||
    !releaseDate ||
    !title ||
    !voteAverage ||
    !voteCount ||
    !tmdbId
  ) {
    res.status(400);
    throw new Error(
      "Missing one or more required fields, please try again with all the required fields"
    );
  }

  // find the movie if already exist
  const movieExist = await Movie.findOne({ title });
  if (movieExist) {
    res.status(400);
    throw new Error(
      "Movie with given title already exist in the DB, please provide a different title"
    );
  }
  const newMovie = await Movie.create({
    adult,
    backdropPath,
    genres,
    originalLanguage,
    originalTitle,
    overview,
    popularity,
    posterPath,
    releaseDate,
    title,
    video,
    voteAverage,
    voteCount,
    isTrending,
    isNowPlaying,
    tmdbId,
  });

  res.status(200).json({
    success: true,
    message: `${newMovie.title} created successfully`,
    movie: newMovie,
  });
});

const searchMovieByKeyword = asyncHandler(async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            { originalTitle: { $regex: req.query.search, $options: "i" } },
            { originalLanguage: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const queryResult = await Movie.find(keyword);

    if (queryResult.length === 0) {
      res.status(200).json({
        success: false,
        message: "No Movie Exist",
        movieList: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      movieList: queryResult,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

const searchMovieByGenre = asyncHandler(async (req, res) => {
  try {
    const queryResult = await Movie.find({ genres: req.query.search });

    if (queryResult.length === 0) {
      res.status(200).json({
        success: false,
        message: "No Movie Exist",
        movieList: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      movieList: queryResult,
    });
  } catch (err) {
    res.status(500);
    throw new Error(err);
  }
});

module.exports = {
  getAllMovie,
  getMovieById,
  updateMovieDetails,
  deleteMovieById,
  createNewMovie,
  searchMovieByKeyword,
  searchMovieByGenre,
};
