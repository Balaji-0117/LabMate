require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
app.use(cors());

//middleware
app.use(express.json());

const authRoutes = require("./routes/auth_routes");
app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(PORT, (req,res)=> {
    console.log(`Server is Running on http://localhost:${PORT}`);
})


