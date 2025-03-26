// module.exports = (err, req, res, next) => {
//     console.error("❌ Error:", err.message);
  
//     const statusCode = err.status || 500;
//     const response = {
//       status: statusCode,
//       error: statusCode === 500 ? "Internal Server Error" : err.name,
//       message: statusCode === 500 ? "Something went wrong on the server" : err.message,
//     };
  
//     res.status(statusCode).json(response);
//   };