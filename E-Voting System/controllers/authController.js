const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  const { voter_id, name, password } = req.body;

  // Check if voter exists in master table
  db.query(
    "SELECT * FROM voter_master WHERE voter_id = ?",
    [voter_id],
    async (err, result) => {
      if (err) return res.send("Error ❌");

      if (result.length === 0) {
        return res.send("Invalid Voter ID ❌");
      }

      // Check if already registered
      db.query(
        "SELECT * FROM users WHERE voter_id = ?",
        [voter_id],
        async (err, user) => {
          if (err) return res.send("Error ❌");

          if (user.length > 0) {
            return res.send("Already registered ❌");
          }

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Insert user
          db.query(
            "INSERT INTO users (voter_id, name, password) VALUES (?, ?, ?)",
            [voter_id, name, hashedPassword],
            (err) => {
              if (err) {
                console.log(err);
                return res.send("Error ❌");
              }

              res.send("Registered Successfully ✅");
            }
          );
        }
      );
    }
  );
};

// ================= LOGIN =================
exports.login = (req, res) => {
  const { voter_id, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE voter_id = ?",
    [voter_id],
    async (err, result) => {
      if (err) return res.send("Error ❌");

      if (result.length === 0) {
        return res.send("User not found ❌");
      }

      const user = result[0];

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.send("Wrong password ❌");
      }

      // 🔐 Generate JWT Token
      const token = jwt.sign(
        {
          id: user.id,
          voter_id: user.voter_id
        },
        "secretkey", // you can change this later
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login Successful ✅",
        token: token
      });
    }
  );
};