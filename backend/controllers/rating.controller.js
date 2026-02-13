const db = require("../config/db");

exports.addRating = (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Only users can rate" });
  }

  const { booking_id, rating, comment } = req.body;
  const userId = req.user.id;

  if (!booking_id || !rating) {
    return res.status(400).json({ message: "Booking and rating required" });
  }

  // Ensure booking belongs to user & is completed
  const checkSql = `
    SELECT provider_id FROM bookings
    WHERE id = ? AND user_id = ? AND status = 'COMPLETED'
  `;

  db.query(checkSql, [booking_id, userId], (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid booking" });
    }

    const providerId = results[0].provider_id;

    const insertSql = `
      INSERT INTO ratings (booking_id, user_id, provider_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [booking_id, userId, providerId, rating, comment || null],
      err => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        res.json({ message: "Rating submitted" });
      }
    );
  });
};
