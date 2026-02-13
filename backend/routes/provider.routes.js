const express = require("express");
const router = express.Router();
const providerController = require("../controllers/provider.controller");
const { verifyToken } = require("../middleware/auth.middleware");

router.get("/bookings", verifyToken, providerController.getPendingBookings);
router.post("/bookings/:id/accept", verifyToken, providerController.acceptBooking);
router.post("/bookings/:id/complete", verifyToken, providerController.completeBooking);

module.exports = router;
