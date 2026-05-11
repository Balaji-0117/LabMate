const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');

router.post('/login', adminAuthController.login);
router.post('/signup', adminAuthController.signup);

module.exports = router;
