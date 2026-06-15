const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/config");
const userSvc = require("../modules/user/user.service");

const createError = (status, message) => {
  const error = new Error(message);
  error.code = status;
  error.status = message.toUpperCase().replace(/ /g, '_');
  return error;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated"));
    }

    const decoded = jwt.verify(token, AppConfig.jwtSecret);
    const user = await userSvc.getSingleRowByFilter({ _id: decoded.id });
    if (!user) {
      return next(createError(403, "User was deleted or does not exist"));
    }

    req.user = { id: user._id, isAdmin: user.role === 'admin' };
    req.loggedInUser = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    return next(createError(401, "Invalid token"));
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(createError(401, "You are not authenticated"));
    }

    const decoded = jwt.verify(token, AppConfig.jwtSecret);
    
    if (decoded.isAdmin && decoded.role === 'admin') {
      req.user = { id: decoded.id, isAdmin: true };
      req.loggedInUser = {
        _id: decoded.id,
        name: "Admin User",
        email: "superadmin@gmail.com",
        role: 'admin'
      };
      return next();
    }
    
    const user = await userSvc.getSingleRowByFilter({ _id: decoded.id });
    if (!user) {
      return next(createError(403, "User was deleted or does not exist"));
    }
    
    if (user.role !== 'admin') {
      return next(createError(403, "Access denied: Admin privileges required"));
    }

    req.user = { id: user._id, isAdmin: true };
    req.loggedInUser = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(createError(401, "Token expired"));
    }
    return next(createError(401, "Invalid token"));
  }
};

module.exports = { verifyToken, verifyAdmin };