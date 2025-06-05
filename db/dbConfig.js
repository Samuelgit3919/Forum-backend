const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const dbConn = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Optional, used for production environments like Supabase/Render
  },
});

// Test the connection
dbConn.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connected! Time:', res.rows[0].now);
  }
});


// Function to create tables
const createTables = async () => {
  try {
    await dbConn.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS questions (
        question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbConn.query(`
      CREATE TABLE IF NOT EXISTS answers (
        answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully with UUID support.");
  } catch (error) {
    console.error("Error creating tables:", error.message);
  }
};
// const dropTables = async () => {
//   try {
//     await dbConn.query('DROP TABLE IF EXISTS answers, questions, users CASCADE');
//     console.log("Tables dropped successfully.");
//   } catch (error) {
//     console.error("Error dropping tables:", error.message);
//   }
// };

// Run table creation
createTables();
// dropTables()

module.exports = dbConn;
