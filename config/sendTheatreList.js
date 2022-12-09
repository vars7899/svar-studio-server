function sendTheatreList(res, theatreList, statusCode) {
  if (theatreList.length === 0) {
    return res.status(statusCode).json({
      success: true,
      message: "No theatre's available",
      theatreList,
    });
  }
  res.status(statusCode).json({
    success: true,
    message: "List of theatre's list fetched successfully",
    theatreList,
  });
}

module.exports = sendTheatreList;
