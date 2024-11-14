const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: ["LOGIN", "SIGNUP" , "LOGOUT","CREATE", "UPDATE", "DELETE", "OTHER"], // Customize as needed
  },
  activityDetails: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["USER", "ADMIN"], // Customize as needed
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isMarkDelete: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("UserLog", userLogSchema);
