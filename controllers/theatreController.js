const asyncHandler = require("express-async-handler");
const createAddress = require("../config/createAddress");
const sendTheatreList = require("../config/sendTheatreList");
const Address = require("../models/addressModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/TheatreModel");

const getAllTheatre = asyncHandler(async (req, res) => {
  const theatreList = await Theatre.find({});
  sendTheatreList(res, theatreList, 200);
});

const getAllUserTheatre = asyncHandler(async (req, res) => {
  const theatreList = await Theatre.find({ user: req.user._id });
  sendTheatreList(res, theatreList, 200);
});

const getTheatreById = asyncHandler(async (req, res) => {
  const theatreId = req.params.theatreId;

  const theatreExist = await Theatre.findById(theatreId);
  await theatreExist.populate({
    path: "user",
    select: "fullName email image isAdmin -address",
  });
  if (!theatreExist) {
    res.status(400);
    throw new Error("Invalid Theatre ID, theatre does not exist");
  }
  res.status(200).json({
    success: true,
    message: `${theatreExist.name} details fetched successfully`,
    theatre: theatreExist,
  });
});

const addNewTheatre = asyncHandler(async (req, res) => {
  const { name, address } = req.body;

  // look for required fields
  if (!name || !address) {
    res.status(400);
    throw new Error("Missing one or more required fields");
  }
  const nameAlreadyTaken = await Theatre.findOne({ name });
  if (nameAlreadyTaken) {
    res.status(400);
    throw new Error("Theatre name already taken");
  }
  // create address
  const addedAddress = await createAddress(res, address);
  if (addedAddress) {
    const newTheatre = await Theatre.create({
      name,
      address: addedAddress._id,
      user: req.user._id,
      trending: [],
      upcoming: [],
      playing: [],
    });
    await newTheatre.populate({
      path: "user",
      select: "fullName email image address",
    });
    if (newTheatre) {
      res.status(200).json({
        success: true,
        message: `${name} added successfully`,
        theatre: newTheatre,
      });
    }
  }
});

const removeTheatre = asyncHandler(async (req, res) => {
  const theatreId = req.params.theatreId;

  // find the theatre
  const theatreExist = await Theatre.findById(theatreId);

  if (!theatreExist) {
    res.status(400);
    2;
    throw new Error("Invalid Theatre ID, theatre does not exist");
  }

  await Theatre.findByIdAndDelete(theatreExist._id);
  res.status(200).json({
    success: true,
    message: `${theatreExist.name} Theatre deleted successfully`,
  });
});

const updateTheatreDetails = asyncHandler(async (req, res) => {
  const theatreId = req.params.theatreId;
  const { name, address } = req.body;

  const updatedTheatre = await Theatre.findByIdAndUpdate(
    theatreId,
    { name },
    { new: true }
  );

  if (address) {
    const { street, city, state, country, postalCode, lat, lng } = address;

    // update address
    await Address.findByIdAndUpdate(
      updatedTheatre.address._id,
      { street, city, state, country, postalCode, lat, lng },
      { new: true }
    );
  }

  const theatreDetails = await Theatre.findById(updatedTheatre._id);

  res.status(200).json({
    success: true,
    message: `${theatreDetails.name} Theatre details updated successfully`,
    theatre: theatreDetails,
  });
});

const addMovieToTheatre = asyncHandler(async (req, res) => {
  const { movieId, theatreId } = req.body;

  const theatreExist = await Theatre.findById(theatreId);
  if (!theatreExist) {
    res.status(400);
    throw new Error(
      "Invalid Theatre ID, Theatre with provided ID does not exist, please try again"
    );
  }

  // check if movie already exist
  if (
    theatreExist.movies.find(
      (item) => item._id.toString() == movieId.toString()
    )
  ) {
    res.status(400);
    throw new Error("Movie Already exist");
  }

  const movieExist = await Movie.findById(movieId);
  if (!movieExist) {
    res.status(400);
    throw new Error(
      "Invalid Movie ID, movie with provided ID does not exist, please try again"
    );
  }

  // add movie to theatre
  theatreExist.movies.push(movieId);
  await theatreExist.save();

  res.status(200).json({
    success: true,
    message: `${movieExist.title} added to ${theatreExist.name} successfully`,
    theatre: theatreExist,
  });
});

const deleteMovieFromTheatre = asyncHandler(async (req, res) => {
  const { movieId, theatreId } = req.body;

  const theatreExist = await Theatre.findById(theatreId);
  if (!theatreExist) {
    res.status(400);
    throw new Error(
      "Invalid Theatre ID, Theatre with provided ID does not exist, please try again"
    );
  }

  // check if movie does not exist in theatre
  if (
    !theatreExist.movies.find(
      (item) => item._id.toString() == movieId.toString()
    )
  ) {
    res.status(400);
    throw new Error("Movie Already exist");
  }

  const movieExist = await Movie.findById(movieId);
  if (!movieExist) {
    res.status(400);
    throw new Error(
      "Invalid Movie ID, movie with provided ID does not exist, please try again"
    );
  }

  // add movie to theatre
  theatreExist.movies = theatreExist.movies.filter(
    (item) => item._id.toString() !== movieId
  );
  await theatreExist.save();

  res.status(200).json({
    success: true,
    message: `${movieExist.title} added to ${theatreExist.name} successfully`,
    theatre: theatreExist,
  });
});

module.exports = {
  getAllTheatre,
  getAllUserTheatre,
  addNewTheatre,
  removeTheatre,
  updateTheatreDetails,
  getTheatreById,
  addMovieToTheatre,
  deleteMovieFromTheatre,
};
