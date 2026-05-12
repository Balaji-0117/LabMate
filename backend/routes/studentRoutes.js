const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateExperimentIdParam, validateRecordIdParam, validateObservationData } = require('../middleware/validators');

router.get('/dashboard', studentController.getDashboard);
router.get('/experiments', studentController.getExperiments);
router.get('/experiments/:id', validateExperimentIdParam, studentController.getExperimentDetail);
router.post('/experiments/:id/complete', validateExperimentIdParam, validateObservationData, studentController.completeExperiment);
router.get('/progress', studentController.getProgress);
router.get('/announcements', studentController.getAnnouncements);
router.get('/leaderboard', studentController.getLeaderboard);
router.get('/records/:recordId/pdf', validateRecordIdParam, studentController.downloadLabRecordPdf);

module.exports = router;
