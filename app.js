const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 5500;
//db conn
const dbConn = require("./db/dbConfig");

app.use(cors());
//any requset alog with the ride they have to post json data
app.use(express.json());
//user middleware file
const userRoute = require("./routes/userRoute");
const questionRoute = require("./routes/questionRoute");
const authMiddleware = require("./middleware/authMiddleware");

const answerRoute = require("./routes/answerRoute");


const searchData = require("./routes/searchRoute");


app.get("/", (req, res) => {
  res.send("Welcome to the forum!");
});
app.use("/api/que/", authMiddleware, questionRoute);
//answer middleware file
// const userRoute=require("./Routes/userRoute")
app.use("/api/users", userRoute);
app.use("/api/askQuestion", authMiddleware, questionRoute);
app.use("/api/answer", authMiddleware, answerRoute);
app.use("/api/search", authMiddleware, searchData);
async function start() {
  try {
    const result = await dbConn.execute("select 'test'");

    app.listen(PORT);
    console.log("DB is Connected");
    console.log(`You server is running at http://localhost:${PORT}`);
  } catch (err) {
    console.log(err.message);
  }
}
start();
