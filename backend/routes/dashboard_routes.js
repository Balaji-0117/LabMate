const express = require("express");

const router = express.Router();

const dashboardController =
    require("../controllers/dashboard_controller");

const verifyToken =
    require("../middleware/verifyToken");

router.get(
    "/dashboard",
    verifyToken,
    dashboardController.getDashboard
);

module.exports = router;