const jwt = require('jsonwebtoken');
const User = require('../models/user');
const responseHandler = require('../utils/responseHandler');

module.exports.authenticate = function (roles) {
  return async function (req, res, next) {
    try {
      // Get the token from cookies
      const token = req.cookies?.token;
      if (!token) {
        return responseHandler.generateError(res, "Unauthorized access - Token not found", null);
      }

      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded) {
        return responseHandler.generateError(res, "Invalid token", null);
      }

      // Find user by ID from the decoded token
      const user = await User.findById(decoded.userId);
      if (!user) {
        return responseHandler.generateError(res, "User not found", null);
      }

      const currentTimestamp = Math.floor(Date.now() / 1000); 
      if (decoded.exp < currentTimestamp) {
        return responseHandler.generateError(res, "Session expired. Please log in again.", null);
      }

      if (roles && !roles.includes(user.role)) {
        return responseHandler.generateError(res, "You don't have permission to access this URL.", null);
      }
      req.user = user;
      next();
    } catch (error) {
      return responseHandler.generateError(res, "Authentication failed", error);
    }
  };
};
