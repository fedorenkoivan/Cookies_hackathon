import sqlite3 from "sqlite3";
import dotenv from "dotenv";

sqlite3.verbose();
dotenv.config();

export const db = new sqlite3.Database("./database/database.db", (err) => {
  if (err) {
    console.log("Connection failed:", err);
  } else {
    console.log("Successfully connected to the database");
  }
});
