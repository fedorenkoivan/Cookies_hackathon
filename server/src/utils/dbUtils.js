import { db } from "../config/db.js";

const userTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mobile TEXT,
    password TEXT NOT NULL,
    userType TEXT CHECK(userType IN ('user', 'admin')) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// const questTableQuery = `CREATE TABLE IF NOT EXISTS quests (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     content TEXT NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );`;

const createTable = async (tableName, query) => {
  try {
    await new Promise((resolve, reject) => {
      db.run(query, (err) => {
        err ? reject(err) : resolve();
      });
    }) 
    console.log(`${tableName} table created or already exists`);
  } catch (error) {
    console.log(`Error creating ${tableName}`, error);
  }
};

export const createAllTable = async () => {
  try {
    await createTable("users", userTableQuery);
    // await createTable("quests", questTableQuery);
    console.log("All tables created successfully!");
  } catch (error) {
    console.log("Error creating tables", error);
    throw error;
  }
};
