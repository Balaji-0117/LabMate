const express = require("express");
const { chatWithAI } = require("../controllers/aiController");
const { validateAiMessage } = require('../middleware/validators');

const router = express.Router();

router.post("/ai", validateAiMessage, chatWithAI);

module.exports = router;