const express = require("express");
const router = express.Router();
const { getRelatedData } = require("../controller/searchController");

router.get("/", getRelatedData);

module.exports = router;
