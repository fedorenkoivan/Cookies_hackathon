const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const db = new sqlite3.Database("./database/database.db", (err) => {
  if (err) {
    console.log("Connection failed:", err);
  } else {
    console.log("Successfully connected to the database");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  password TEXT
)`,
  (err) => {
    if (err) {
      console.log("Table creation failed:", err);
    } else {
      console.log("Table 'users' is ready.");
    }
  },
);

// db.run(
//   `
//   CREATE TABLE IF NOT EXISTS quests (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT,
//     description TEXT,
//     category TEXT,
//     time_limit INTEGER,
//     image_url TEXT
//   )
// `,
//   (err) => {
//     if (err) {
//       console.log("Table creation failed:", err);
//     } else {
//       console.log("Table 'quests' is ready.");
//     }
//   },
// );

//http-requests

// app.get("/check-users", (req, res) => {
//   db.all("SELECT * FROM users", [], (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json(rows);
//   });
// });

app.post("/quests", upload.single("image"), (req, res) => {
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
    },
  );
});

app.get("/quests", (req, res) => {
  db.all("SELECT * FROM quests", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

//Тимчасова таблиця для відгуків, потім зробити по айді
//щоб додавилися в кожен квест окремо

db.run(
  `
  CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT,
  rating INTEGER
  )
`,
  (err) => {
    if (err) {
      console.log("Table creation failed:", err);
    } else {
      console.log("Table 'ratings' is ready.");
    }
  },
);

app.post("/reviews", (req, res) => {
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

app.get("/reviews", (req, res) => {
  db.all("SELECT * FROM ratings", [], (err, rows) => {
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
