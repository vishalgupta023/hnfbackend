const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const dbName = "hnFAssignment";
  try {
    // Construct the full URI by appending the dbName correctly
    const uri = `${process.env.MONGO_URI}${dbName}`;
    console.log("Connecting to MongoDB:", uri);  // Optionally log the URI to verify
    await mongoose.connect(uri, {
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
