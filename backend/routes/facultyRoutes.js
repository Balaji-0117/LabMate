const express = require('express');
const router = express.Router();
const facultyAuthController = require('../controllers/facultyAuthController');

router.post('/login', facultyAuthController.login);
router.post('/signup', facultyAuthController.signup);

module.exports = router;
