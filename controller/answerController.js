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
        U.userid AS user_id, 
        A.created_at 
      FROM answers A 
      JOIN users U ON U.userid = A.userid 
      JOIN questions Q ON Q.question_id = A.question_id 
      WHERE A.question_id = ? 
      ORDER BY A.created_at DESC
    `;

    const [rows] = await dbConn.query(query, [question_id]);

    // If no answers are found for the question
    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No answers found for this question.",
      });
    }

    // Format and send response with structured data
    const formattedAnswers = rows.map((answer) => ({
      answerId: answer.answer_id,
      content: answer.content,
      username: answer.username,
      userId: answer.user_id,
      createdAt: answer.created_at,
    }));

    return res.json({
      questionTitle: rows[0].title, // Assuming all answers are for the same question
      answers: formattedAnswers,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Something went wrong. Please try again later.",
    });
  }
}

async function postAnswer(req, res) {
  // const { userId } =
  const { answer } = req.body;
  
  const { question_id } = req.params;
  console.log("my data to post answer", question_id);

  const { userId } = req.user;
  console.log("thiiisss", userId);

  if (!question_id || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide answer and question ID",
    });
  }

  try {
    const insertAnswer =
      "INSERT into answers(question_id,content,userid)  value (?,?,?)";

    const checkk = await dbConn.query(insertAnswer, [
      question_id,
      answer,
      userId,
    ]);

    // console.log("yessss")
    return res.status(StatusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: err.message,
      message: "Something Went Wrong .try again later!ss",
    });
  }
}

module.exports = {
  postAnswer,
  getAnswer,
};
