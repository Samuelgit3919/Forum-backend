const dbConn = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");

async function getAllQuestion(req, res) {
  try {
    const fetchQuestion =
      "SELECT Q.question_id, Q.title, Q.content, Q.created_at, U.username FROM questions Q JOIN users U ON U.userid = Q.userid ORDER BY created_at DESC";
    const [data] = await dbConn.query(fetchQuestion);
    console.log(data.length);
    if (!data || data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "404 Not Found",
        message: "No questions found.",
      });
    }
    return res.status(StatusCodes.OK).json({
      questions: data,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function askQuestion(req, res) {
  const { title, description } = req.body;
  const { userId } = req.user;

  console.log(userId);
  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    const questionId = uuidv4();
    console.log(questionId);
    const postQue =
      "INSERT INTO questions (question_id, title, content, userid) VALUES (?,?,?,?)";

    await dbConn.query(postQue, [questionId, title, description, userId]);

    return res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully.",
      questionId: questionId, // Changed from data.insertId to questionId
    });
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

async function getSingleQuestion(req, res) {
  const { question_id } = req.params;
  console.log(question_id);

  if (!question_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      // Added return statement
      error: "Bad Request",
      message: "Question ID is required.",
    });
  }

  try {
    const getSingleQue = "SELECT * FROM questions WHERE question_id = ?";
    const [data] = await dbConn.query(getSingleQue, [question_id]);
    console.log(data);
    if (!data || data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found.",
      });
    }
    return res.status(StatusCodes.OK).json({
      question: data[0], // Return first item since it's a single question
    });
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { getSingleQuestion, getAllQuestion, askQuestion };
