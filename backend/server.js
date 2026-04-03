const express = require('express');
const app = express();

//middleware
app.use(express.json());

// Defining a simple route
app.get("/", (req,res)=> {
    res.send("LabMate Server is Running!");
})

const PORT = 3000;
app.listen(PORT, (req,res)=> {
    console.log(`Server is Running on http://localhost:${PORT}`);
})
