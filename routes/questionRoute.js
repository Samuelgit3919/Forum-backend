const express = require("express");
const {
  askQuestion,
  getSingleQuestion,
  getAllQuestion,
} = require("../controller/questionController");
const router = express.Router();

router.get("/", getAllQuestion);
router.get("/:question_id", getSingleQuestion);
router.post("/", askQuestion);

module.exports = router;
