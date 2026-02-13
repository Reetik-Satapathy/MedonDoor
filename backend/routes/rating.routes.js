const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.post("/add", verifyToken, ratingController.addRating);

module.exports = router;
