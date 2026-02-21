require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/providers", require("./routes/provider.routes"));
app.use("/api/ratings", require("./routes/rating.routes"));

// Redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/pages/login.html");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 MedOnDoor Server is running!");
  console.log("=".repeat(50));
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`📍 Network: http://127.0.0.1:${PORT}`);
  console.log("=".repeat(50));
});
