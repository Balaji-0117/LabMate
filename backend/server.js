require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());

//middleware
app.use(express.json());

const authRoutes = require("./routes/auth_routes");
app.use("/api/auth", authRoutes);

const dashboardRoutes = require("./routes/dashboard_routes");
app.use("/api", dashboardRoutes);

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
// ERROR MIDDLEWARE
// ===============================
app.use(errorHandler);

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, (req,res)=> {
    console.log(`Server is Running on http://localhost:${PORT}`);
})


