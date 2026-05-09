const express = require("express");

const {
    chatWithAI
} = require("../controllers/aiController");

const router = express.Router();

router.post("/ai", chatWithAI);

module.exports = router;