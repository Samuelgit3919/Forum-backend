const express = require("express");
const router = express.Router();
const {
  register,
  login,
  checkUser,
  logout,
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.post("/logout", authMiddleware, logout);

router.get("/check", authMiddleware, checkUser);

module.exports = router;
