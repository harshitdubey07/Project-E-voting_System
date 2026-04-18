const express = require("express");
const cors = require("cors");
const db = require("./db");

// Routes
const authRoutes = require("./routes/authRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();   // ✅ CREATE APP FIRST

app.use(cors());
app.use(express.json());

// ✅ THEN USE ROUTES
app.use("/api", authRoutes);
app.use("/api", voteRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("E-Voting Backend Running 🚀");
});

// DB test
app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) {
      res.send("DB Error ❌");
    } else {
      res.send("DB Connected ✅");
    }
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});