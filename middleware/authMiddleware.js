const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userName, userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userName, userId };
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }
}

module.exports = authMiddleware;
