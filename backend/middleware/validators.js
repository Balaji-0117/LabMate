const { body, param, validationResult } = require('express-validator');

// Middleware to check for validation errors and return 400 if any exist
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Common validations
const validateSignup = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateSetPassword = [
  param('token').isUUID().withMessage('Invalid token format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateExperimentIdParam = [
  param('id').isInt({ min: 1 }).withMessage('Experiment ID must be a positive integer'),
  handleValidationErrors
];

const validateRecordIdParam = [
  param('recordId').isInt({ min: 1 }).withMessage('Record ID must be a positive integer'),
  handleValidationErrors
];

const validateObservationData = [
  body('observation_data').isObject().withMessage('observation_data must be an object'),
  handleValidationErrors
];

const validateAiMessage = [
  body('message').notEmpty().withMessage('Message cannot be empty'),
  handleValidationErrors
];

module.exports = {
  validateSignup,
  validateLogin,
  validateSetPassword,
  validateExperimentIdParam,
  validateRecordIdParam,
  validateObservationData,
  validateAiMessage
};
