const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/dashboard', studentController.getDashboard);
router.get('/experiments', studentController.getExperiments);
router.get('/experiments/:id', studentController.getExperimentDetail);
router.post('/experiments/:id/complete', studentController.completeExperiment);
router.get('/progress', studentController.getProgress);
router.get('/announcements', studentController.getAnnouncements);
router.get('/leaderboard', studentController.getLeaderboard);
router.get('/records/:recordId/pdf', studentController.downloadLabRecordPdf);

module.exports = router;
