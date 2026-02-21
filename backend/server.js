require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
// In Docker: frontend is at ./frontend relative to backend
// In local dev: frontend is at ../frontend relative to backend
const frontendPathDocker = path.join(__dirname, "frontend");
const frontendPathLocal = path.join(__dirname, "../frontend");

// Use Docker path if it exists, otherwise use local dev path
const frontendPath = fs.existsSync(frontendPathDocker) ? frontendPathDocker : frontendPathLocal;
app.use(express.static(frontendPath));

// API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/providers", require("./routes/provider.routes"));
app.use("/api/ratings", require("./routes/rating.routes"));

// Redirect root to login page
app.get("/", (req, res) => {
  res.redirect("/pages/login.html");
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log("=".repeat(50));
  console.log("🚀 MedOnDoor Server is running!");
  console.log("=".repeat(50));
  console.log(`📍 Listening on: ${HOST}:${PORT}`);
  console.log(`📍 Local:   http://localhost:${PORT}`);
  console.log(`📍 Network: http://127.0.0.1:${PORT}`);
  console.log("=".repeat(50));
});
