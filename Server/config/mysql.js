// config/database.js
import mysql from 'mysql2';
import dotenv from 'dotenv';
import initializeModels from '../models/index.js';
// Load environment variables
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
  initializeModels();
});

export default connection