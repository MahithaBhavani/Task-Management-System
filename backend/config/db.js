const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "task_app",
});
db.connect((err) => {
  if (err) {
    console.log("Database Error:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});
module.exports = db;