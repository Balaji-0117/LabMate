const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth_controller");

router.post("/signup", auth.signup);
router.post("/set-password/:token", auth.setPassword);
router.post("/login", auth.login);

module.exports = router;