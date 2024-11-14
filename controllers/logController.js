const UserLog = require("../models/Log");
const responseHandler = require("../utils/responseHandler");
const mongoose = require('mongoose');


 const userLog = async (user, actionType, actionDetails) => {
    try {
      const log = new UserLog({
        userId: user._id,
        activityType: actionType,
        activityDetails: actionDetails,
        role: user.role,
      });
      await log.save();
      console.log("User action logged successfully");
    } catch (error) {
      console.error("Error logging user action:", error);
    }
  };


  const getUserLogs = async (req, res) => {
    try {
      let userId = req.headers['x-user-id'];
       userId =new mongoose.Types.ObjectId(userId);
      if (!userId) {
        return responseHandler.generateForbiddenError(res)
      }
        const logs = await UserLog.find({ userId: userId, isMarkDelete: false }).select("-userId -role -isMarkDelete");
  
      if (!logs) {
        return responseHandler.generateError(res, "No logs found for the given user");
      }
  
      return responseHandler.generateSuccess(res, "Logs fetched successfully!", { logs });
    } catch (error) {
      console.error("Error fetching user logs:", error);
      return responseHandler.generateError(res, "Failed to fetch logs");
    }
  };

  const getAllUsersLogs = async (req, res) => {
    try {
      let userId = req.headers['x-user-id'];
      userId = new mongoose.Types.ObjectId(userId);
  
      if (!userId) {
        return responseHandler.generateForbiddenError(res);
      }
  
      // Get pagination parameters from the query string (default to page 1 and limit 10)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

  
      // Get total count of documents excluding the current user's logs
      const count = await UserLog.countDocuments({
        userId: { $ne: userId },
      });
  
      // Fetch the paginated logs
      const logs = await UserLog.find({
        userId: { $ne: userId },
      })
        .skip(skip)
        .limit(limit)
        .sort({ timestamp: -1 }); // Optional: sort by timestamp, most recent first
  
      if (!logs || logs.length === 0) {
        return responseHandler.generateError(res, "No logs found for the admin use");
      }
  
      // Return the logs along with pagination info
      return responseHandler.generateSuccess(res, "Logs fetched successfully!", {
        logs,
        totalCount: count
      });
    } catch (error) {
      console.error("Error fetching users logs:", error);
      return responseHandler.generateError(res, "Failed to fetch logs");
    }
  };

  const softDeleteLog = async (req, res) => {
    try {
      // Get the log ID from the route parameters
      let logId = req.params.id;  
      // Convert to ObjectId if necessary
      logId = new mongoose.Types.ObjectId(logId);
  
      // Find and update the log document
      const updatedLog = await UserLog.findByIdAndUpdate(
        logId, // Log ID
        { isMarkDelete: true }, // Update field
        { new: true } // Return updated document
      );
  
      // If no log was found, return an error
      if (!updatedLog) {
        return res.status(404).json({
          status: 404,
          message: "Log not found",
        });
      }
  
      // Successfully updated
      return res.status(200).json({
        status: 200,
        message: "Log successfully soft deleted",
        data: updatedLog,
      });
    } catch (error) {
      console.error("Error in soft delete log:", error);
      return res.status(500).json({
        status: 500,
        message: "An error occurred while soft deleting the log",
      });
    }
  };
  
  
  
  



  module.exports ={
    userLog:userLog,
    getUserLogs : getUserLogs,
    getAllUsersLogs : getAllUsersLogs,
    softDeleteLog : softDeleteLog
  }