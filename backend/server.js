require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));
app.use("/api/providers", require("./routes/provider.routes"));
app.use("/api/ratings", require("./routes/rating.routes"));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
