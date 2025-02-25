import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { comment, rating } = req.body;

  const insertQuery = `INSERT INTO ratings (comment, rating) VALUES (?, ?)`;

  db.run(insertQuery, [comment, rating], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Database insertion error");
    }
    res.status(201).json({ comment, rating });
  });
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM ratings", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

export default router;