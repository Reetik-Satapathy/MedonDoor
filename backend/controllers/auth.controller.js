const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, service_type } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (results.length > 0) {
          return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        db.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, role],
          (err, result) => {
            if (err) return res.status(500).json(err);

            const userId = result.insertId;

            // If provider, create provider record
            if (role === "provider") {
              db.query(
                "INSERT INTO providers (user_id, service_type) VALUES (?, ?)",
                [userId, service_type || "doctor"],
                () => {}
              );
            }

            res.status(201).json({ message: "Registration successful" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN

exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN HIT", req.body);

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        role: user.role
      });
    }
  );
};

