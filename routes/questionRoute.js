


const express = require("express");
const {
  askQuestion,
  getSingleQuestion,
  getAllQuestion,
} = require("../Controller/questionController");
const router = express.Router();

router.get("/", getAllQuestion);
router.get("/:question_id", getSingleQuestion);
router.post("/", askQuestion);

module.exports = router;

module, (exports = router);
