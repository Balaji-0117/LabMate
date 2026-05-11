const express = require('express');
const router = express.Router();
const adminDashController = require('../controllers/adminDashController');

router.get('/stats', adminDashController.getStats);
router.get('/users', adminDashController.getUsers);
router.post('/experiments', adminDashController.createExperiment);
router.put('/experiments/:id', adminDashController.updateExperiment);
router.delete('/experiments/:id', adminDashController.deleteExperiment);
router.post('/announcements', adminDashController.createAnnouncement);
router.delete('/announcements/:id', adminDashController.deleteAnnouncement);
router.get('/reports', adminDashController.getReports);

module.exports = router;
