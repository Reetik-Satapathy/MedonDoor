const db = require("../config/db");

exports.getPendingBookings = (req, res) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Access denied" });
  }

  const providerId = req.user.id;

  const sql = `
    SELECT 
      bookings.id,
      services.name AS service_name,
      bookings.status
    FROM bookings
    JOIN services ON bookings.service_id = services.id
    WHERE 
      bookings.status = 'PENDING'
      OR (bookings.status = 'ACCEPTED' AND bookings.provider_id = ?)
  `;

  db.query(sql, [providerId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};


exports.acceptBooking = (req, res) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Access denied" });
  }

  const bookingId = req.params.id;
  const providerId = req.user.id;

  const sql = `
    UPDATE bookings
    SET provider_id = ?, status = 'ACCEPTED'
    WHERE id = ? AND status = 'PENDING'
  `;

  db.query(sql, [providerId, bookingId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    // 🔴 THIS IS THE KEY CHECK
    if (result.affectedRows === 0) {
      return res.status(409).json({
        message: "Booking already accepted by another provider"
      });
    }

    res.json({ message: "Booking accepted successfully" });
  });
};


exports.completeBooking = (req, res) => {
  if (req.user.role !== "provider") {
    return res.status(403).json({ message: "Access denied" });
  }

  const bookingId = req.params.id;
  const providerId = req.user.id;

  const sql = `
    UPDATE bookings
    SET status = 'COMPLETED'
    WHERE id = ? AND provider_id = ?
  `;

  db.query(sql, [bookingId, providerId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Cannot complete booking" });
    }

    res.json({ message: "Booking completed" });
  });
};
