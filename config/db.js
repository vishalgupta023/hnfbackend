// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const dbName = "HnFAssignment"
  try {
    console.log("try to connect ",process.env.MONGO_URI)
    await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
