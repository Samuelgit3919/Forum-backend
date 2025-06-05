const dbConn = require("../db/dbConfig"); // Your PostgreSQL client or pool
const { StatusCodes } = require("http-status-codes");

async function getRelatedData(req, res) {
  const { title } = req.body;

  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Oops... Unable to get this data, title is required.",
    });
  }

  try {
    const queryText = `
      SELECT Q.* 
      FROM questions Q 
      WHERE title ILIKE $1
    `;

    // Use ILIKE for case-insensitive search in Postgres
    const { rows: data } = await dbConn.query(queryText, [`%${title}%`]);

    if (data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No related questions found for the provided title.",
      });
    }

    // console.log(data);

    return res.status(StatusCodes.OK).json({
      message: "Related questions fetched successfully.",
      data,
    });
  } catch (err) {
    console.error("getRelatedData Error:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: err.message,
      message: "Something went wrong. Please try again later.",
    });
  }
}

module.exports = { getRelatedData };
