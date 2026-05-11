const express = require('express');
const router = express.Router();
const facultyDashController = require('../controllers/facultyDashController');

router.get('/students', facultyDashController.getStudents);
router.get('/experiments', facultyDashController.getExperiments);
router.get('/student/:studentId/progress', facultyDashController.getStudentProgress);
router.post('/announcements', facultyDashController.createAnnouncement);
router.get('/reports', facultyDashController.getReports);

module.exports = router;
