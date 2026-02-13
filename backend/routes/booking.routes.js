const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");
const { verifyToken } = require("../middleware/auth.middleware");


router.post("/create", verifyToken, bookingController.createBooking);
router.get("/my", verifyToken, bookingController.getUserBookings);

module.exports = router;
