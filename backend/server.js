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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
