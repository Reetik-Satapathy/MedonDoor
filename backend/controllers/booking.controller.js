const db = require("../config/db");

exports.createBooking = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  const { service_id } = req.body;

  // Only users can create bookings
  if (userRole !== "user") {
    return res.status(403).json({ message: "Only users can create bookings" });
  }

  if (!service_id) {
    return res.status(400).json({ message: "Service ID is required" });
  }

  const sql = `
    INSERT INTO bookings (user_id, service_id, status)
    VALUES (?, ?, 'PENDING')
  `;

  db.query(sql, [userId, service_id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking_id: result.insertId
    });
  });
};

exports.getUserBookings = (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied" });
  }

  const userId = req.user.id;

  const sql = `
    SELECT 
      bookings.id,
      services.name AS service_name,
      bookings.status,
      bookings.created_at
    FROM bookings
    JOIN services ON bookings.service_id = services.id
    WHERE bookings.user_id = ?
    ORDER BY bookings.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};
