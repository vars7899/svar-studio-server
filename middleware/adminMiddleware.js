function isAdmin(req, res, next) {
  const userIsAdmin = req.user.isAdmin;
  if (!userIsAdmin) {
    return res.status(403).json({
      success: false,
      message: "Given user does not have the permission",
    });
  }
  next();
}

module.exports = isAdmin;
