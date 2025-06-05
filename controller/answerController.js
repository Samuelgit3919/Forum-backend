const dbConn = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function getAnswer(req, res) {
  const { question_id } = req.params;

  if (!question_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Question ID is required.",
    });
  }

  try {
    const query = `
      SELECT  
        A.answer_id, 
        A.content, 
        U.username, 
        Q.title, 
        U.user_id AS user_id, 
        A.created_at 
      FROM answers A 
      JOIN users U ON U.user_id = A.user_id
      JOIN questions Q ON Q.question_id = A.question_id 
      WHERE A.question_id = $1
      ORDER BY A.created_at DESC
    `;

    const { rows } = await dbConn.query(query, [question_id]);

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No answers found for this question.",
      });
    }

    const formattedAnswers = rows.map((answer) => ({
      answerId: answer.answer_id,
      content: answer.content,
      username: answer.username,
      userId: answer.user_id,
      createdAt: answer.created_at,
    }));

    return res.status(StatusCodes.OK).json({
      questionTitle: rows[0].title,
      answers: formattedAnswers,
    });
  } catch (err) {
    console.error("Database error:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something went wrong. Please try again later.",
    });
  }
}

async function postAnswer(req, res) {
  const { answer } = req.body;
  const { question_id } = req.params;
  const { userId } = req.user;

  if (!question_id || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer content and question ID.",
    });
  }

  try {
    const insertAnswer = `
      INSERT INTO answers (question_id, content, user_id) 
      VALUES ($1, $2, $3)
      RETURNING answer_id
    `;

    const { rows } = await dbConn.query(insertAnswer, [question_id, answer, userId]);
    const insertedAnswerId = rows[0].answer_id;

    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully.",
      answerId: insertedAnswerId,
    });
  } catch (err) {
    console.error("postAnswer Database error:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something went wrong. Please try again later.",
    });
  }
}

module.exports = {
  postAnswer,
  getAnswer,
};
