const express = require("express");
const router = express.Router();
const { register, login, checkUser, logout } = require("../Controller/userController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/check", authMiddleware, checkUser);

module.exports = router;
