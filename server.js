// backend/server.js
require("dotenv").config();
const express = require("express");
const userAuth = require("./routes/auth");
const todoActions = require("./routes/todo");
const userLogs = require("./routes/logs");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const { createSuperAdmin } = require("./controllers/authController");


const app = express();
app.use(cookieParser());
app.use(cors(
    {origin: process.env.FRONTEND_URL, // Set this to your frontend URL
    credentials: true}  
))

connectDB()
app.use(express.json()); // Middleware to parse JSON requests

app.use("api/v1/auth" , userAuth)
app.use("api/v1/" , todoActions)
app.use("api/v1/" , userLogs)

createSuperAdmin();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
