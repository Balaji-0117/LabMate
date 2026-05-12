require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
// Allow flexible origins for local development (any localhost port and file:// protocols)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === 'null') return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//middleware
app.use(express.json());

const authRoutes = require("./routes/auth_routes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const facultyRoutes = require("./routes/facultyRoutes");
app.use("/api/faculty", facultyRoutes);

const dashboardRoutes = require("./routes/dashboard_routes");
app.use("/api", dashboardRoutes);

const verifyToken = require('./middleware/verifyToken');
const { checkRole } = require('./middleware/verifyToken');

const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', verifyToken, checkRole('student'), studentRoutes);

const adminDashRoutes = require('./routes/adminDashRoutes');
app.use('/api/admin/dashboard', verifyToken, checkRole('admin'), adminDashRoutes);

const facultyDashRoutes = require('./routes/facultyDashRoutes');
app.use('/api/faculty', verifyToken, checkRole('admin'), facultyDashRoutes);

const aiRoutes = require("./routes/aiRoutes");
const errorHandler = require("./middleware/errorMiddleware");

app.use("/api", aiRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
    res.send("LabMate AI Server Running");
});

// ===============================
// ENV VARIABLES FOR FRONTEND
// ===============================
app.get("/env", (req, res) => {
    res.json({ apiBase: process.env.BASE_URL || "http://localhost:5000" });
});

// ===============================
// ERROR MIDDLEWARE
// ===============================
app.use(errorHandler);

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is Running on http://localhost:${PORT}`);
    });
}

module.exports = app;


