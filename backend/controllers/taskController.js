const db = require("../config/db");
const getAllTasks = (req, res) => {
  const sql = "SELECT * FROM tasks";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  });
};
module.exports = {
  getAllTasks,
};