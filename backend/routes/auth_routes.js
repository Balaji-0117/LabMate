const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth_controller");
const { validateSignup, validateLogin, validateSetPassword } = require('../middleware/validators');

router.post("/signup", validateSignup, auth.signup);
router.post("/set-password/:token", validateSetPassword, auth.setPassword);
router.post("/login", validateLogin, auth.login);

module.exports = router;