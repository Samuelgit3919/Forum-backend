const express = require("express");
const router = express.Router();
const {getAnswer,postAnswer} =require("../Controller/answerController")


router.post("/:question_id",postAnswer)
router.get("/:question_id",getAnswer)


module.exports=router