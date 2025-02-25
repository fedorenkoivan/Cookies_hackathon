import express from "express";
import { db } from "../config/db.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  const { title, description, category, time_limit } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  const insertQuery = `INSERT INTO quests (title, description, category, time_limit, image_url) VALUES (?, ?, ?, ?, ?)`;

  db.run(
    insertQuery,
    [title, description, category, time_limit, image_url],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Database insertion error");
      }
      res.status(201).json({ image_url });
    }
  );
});

router.get("/", (req, res) => {
  db.all("SELECT * FROM quests", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

export default router;