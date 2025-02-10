const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database/database.db", (err) => {
  if (err) {
    console.log("Connection failed:", err);
  } else {
    console.log("Successfully connected to the database");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  password TEXT
)`, (err) => {
  if (err) {
      console.log("Table creation failed:", err);
  } else {
      console.log("Table 'users' is ready.");
  }
});

const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

app.get("/check-users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
