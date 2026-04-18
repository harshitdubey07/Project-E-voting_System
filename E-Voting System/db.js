const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "H@rshu8090",
  database: "evoting"
});

db.connect((err) => {
  if (err) {
    console.log("DB Error ❌", err);
  } else {
    console.log("DB Connected ✅");
  }
});

module.exports = db;