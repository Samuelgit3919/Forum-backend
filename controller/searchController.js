const jwt = require("jsonwebtoken");
const dbConn = require("../DB/dbConfig");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { StatusCodes } = require("http-status-codes");

async function getRelatedData(req, res) {
  const { title } = req.body;
  if (!title) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Oppsss...Not unable to get this Data",
    });
  }
  try {
    const whoAMI = 'SELECT Q.* FROM questions Q WHERE title LIKE ?';
    const [data] = await dbConn.query(whoAMI, [`%${title}%`]);

    if (data.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No related questions found for the provided title.",
      });
    }

    console.log(data);

    return res.status(StatusCodes.OK).json({
      message: "Related questions fetched successfully.",
      data: data,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: err.message,
      message: "Something Went Wrong .try again later!ss",
    });
  }
}
module.exports = { getRelatedData };
