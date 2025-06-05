// db Connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  // console.log(username, first_name, last_name, email, password)

  if (!username || !first_name || !last_name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const existingUserQuery = `
      SELECT user_id, username FROM users WHERE username = $1 OR email = $2
    `;
    const existingUserResult = await dbConnection.query(existingUserQuery, [username, email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "User already exists",
      });
    }

    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = `
      INSERT INTO users (username, first_name, last_name, email, password)
      VALUES ($1, $2, $3, $4, $5)
    `;

    await dbConnection.query(insertQuery, [
      username,
      first_name,
      last_name,
      email,
      hashedPassword,
    ]);

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something went wrong. Try again later!",
    });
  }
}

// End of register function

const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log("Attempting login:", email);

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide both email and password",
    });
  }

  try {
    // Use $1 placeholder for PostgreSQL parameterized query
    const queryText = `SELECT user_id, username, email, password FROM users WHERE email = $1`;
    const { rows } = await dbConnection.query(queryText, [email]);

    if (rows.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Create JWT payload
    const payload = {
      userId: user.user_id,
      userName: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(StatusCodes.OK).json({
      message: "User login successful",
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something went wrong. Try again later!",
    });
  }
};


// End of Login function

async function checkUser(req, res) {
  const username = req.user.userName;
  const userid = req.user.user_id;
  // console.log(userid, username);
  res.status(StatusCodes.OK).json({ msg: "sami", username, userid });
}

async function logout(req, res) {
  res.send({
    message: "User logged out successfully",
  });
}

module.exports = { register, login, checkUser, logout };
