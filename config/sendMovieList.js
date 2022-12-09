function sendMovieList(res, movieList, statusCode) {
  if (movieList.length === 0) {
    return res.status(statusCode).json({
      success: true,
      message: "No Movie's available",
      movieList,
    });
  }
  res.status(statusCode).json({
    success: true,
    message: "List of Movie's list fetched successfully",
    movieList,
  });
}

module.exports = sendMovieList;
