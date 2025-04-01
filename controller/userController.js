// db Connection
const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !first_name || !last_name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const [existingUser] = await dbConnection.query(
      "select user_id,username from users where username=? or email=?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "User already existed",
      });
    }

    if (password.length <= 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "password must be at least 8 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const insertUser =
      "INSERT INTO users ( username, first_name, last_name, email, password) VALUE (?,?,?,?,?)";

    await dbConnection.query(insertUser, [
      username,
      first_name,
      last_name,
      email,
      hashedpassword,
    ]);

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something Went Wrong .try again later!",
    });
  }
}
// End of register function

async function login(req, res) {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const [user] = await dbConnection.query(
      "select email,user_id ,username ,password from users where  email=? ",
      [email]
    );

    if (user.length == 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Unauthorized",
        message: "Invalid username or password",
      });
    }

    const isMatched = await bcrypt.compare(password, user[0].password);
    if (!isMatched) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid username or password",
      });
    }

    const userName = user[0].username;
    const userId = user[0].user_id;

    console.log(userName, userId);

    const token = jwt.sign(
      {
        userName,
        userId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(StatusCodes.OK).json({
      message: "user login successfully",
      token,
      userName,
    });
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something Went Wrong .try again later!",
    });
  }
}
// End of Login function

async function checkUser(req, res) {
  const username = req.user.userName;
  const userid = req.user.user_id;
  console.log(userid, username);
  res.status(StatusCodes.OK).json({ msg: "sami", username, userid });
}

async function logout(req, res) {
  res.send({
    message: "User logged out successfully",
  });
}



module.exports = { register, login, checkUser, logout };
