const express = require("express");
const router = express.Router();
const {getRelatedData} =require("../Controller/searchController");

router.get("/",getRelatedData);

module.exports=router
