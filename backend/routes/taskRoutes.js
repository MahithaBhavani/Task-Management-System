const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL TASKS
router.get("/", (req, res) => {
  const sql = "SELECT * FROM tasks";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
});

// CREATE TASK
router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  const sql =
    "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";

  db.query(
    sql,
    [title, description || "", status || "TODO"],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Task created",
        taskId: result.insertId,
      });
    }
  );
});

// UPDATE TASK
router.put("/:id", (req, res) => {
  const { title, status } = req.body;

  const sql =
    "UPDATE tasks SET title = ?, status = ? WHERE id = ?";

  db.query(
    sql,
    [title, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Task updated",
      });
    }
  );
});

// DELETE TASK
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({
      message: "Task deleted",
    });
  });
});

module.exports = router;