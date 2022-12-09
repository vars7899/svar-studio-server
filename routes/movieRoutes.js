const { getAllMovie } = require("../controllers/movieController");
const router = require("express").Router();

router.route("/").get(getAllMovie);

module.exports = router;
