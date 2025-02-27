import { db } from "../config/db.js";

const userTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mobile TEXT,
    password TEXT NOT NULL,
    userType TEXT DEFAULT 'user' CHECK(userType IN ('user', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

const questTableQuery = `
  CREATE TABLE IF NOT EXISTS quests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    category TEXT,
    time_limit INTEGER,
    image_url TEXT
  );
`;

const ratingTableQuery = `
  CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comment TEXT,
  rating INTEGER
);
`;

const createTable = async (tableName, query) => {
  try {
    await new Promise((resolve, reject) => {
      db.run(query, (err) => {
        err ? reject(err) : resolve();
      });
    });
    console.log(`${tableName} table created or already exists`);
  } catch (error) {
    console.log(`Error creating ${tableName}`, error);
  }
};

export const createAllTable = async () => {
  try {
    await createTable("users", userTableQuery);
    await createTable("quests", questTableQuery);
    await createTable("ratings", ratingTableQuery);
    console.log("All tables created successfully!");
  } catch (error) {
    console.log("Error creating tables", error);
    throw error;
  }
};
