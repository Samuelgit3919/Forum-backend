const mysql2 = require("mysql2");

const dbConn = mysql2.createPool({
  // user: process.env.USER,
  // database: process.env.DATABASE,
  // password:process.env.PASSWORD,
  // connectionLimit: 10,

  host: "sql8.freesqldatabase.com", // Remote host
  user: "sql8769241", // Database user
  database: "sql8769241", // Database name
  password: "pygaxvVFex", // Database password
  port: 3306, // MySQL port
  connectionLimit: 10, // Maxi
});
// console.log(process.env.DATABASE)
dbConn.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    // console.log("Connected to the database.");
    connection.release();
  }
});

module.exports = dbConn.promise();
