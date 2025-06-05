const dbConn = require("../db/dbConfig");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");

// Get all questions
async function getAllQuestion(req, res) {
  try {
    const query = `
      SELECT 
        Q.question_id, 
        Q.title, 
        Q.description, 
        Q.created_at, 
        U.username
      FROM questions Q
      JOIN users U ON Q.user_id = U.user_id
      ORDER BY Q.created_at DESC
    `;

    const { rows } = await dbConn.query(query);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found.",
      });
    }

    return res.status(StatusCodes.OK).json({ questions: rows });
  } catch (err) {
    console.error("getAllQuestion Error:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching questions.",
    });
  }
}

// Ask a new question
async function askQuestion(req, res) {
  const { title, description } = req.body;
  const { userId } = req.user;
  console.log(title, description);

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Title and description are required.",
    });
  }

  try {
    const questionId = uuidv4();
    const query = `
      INSERT INTO questions (question_id, title, description, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING question_id
    `;

    const { rows } = await dbConn.query(query, [
      questionId,
      title,
      description,
      userId,
    ]);

    return res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully.",
      questionId: rows[0].question_id,
    });
  } catch (err) {
    console.error("askQuestion Error:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Failed to post question. Please try again later.",
    });
  }
}

// Get a single question by ID
async function getSingleQuestion(req, res) {
  const { question_id } = req.params;

  if (!question_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Question ID is required.",
    });
  }

  try {
    const query = `SELECT * FROM questions WHERE question_id = $1`;
    const { rows } = await dbConn.query(query, [question_id]);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "Question not found.",
      });
    }

    return res.status(StatusCodes.OK).json({ question: rows[0] });
  } catch (err) {
    console.error("getSingleQuestion Error:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Failed to fetch the question. Try again later.",
    });
  }
}

// Export all functions at once
module.exports = {
  getAllQuestion,
  askQuestion,
  getSingleQuestion,
};