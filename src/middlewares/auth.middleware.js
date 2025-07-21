const authSvc = require("../modules/auth/auth.service");
const userSvc = require("../modules/user/user.service");
const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/config");
const { UserRoles } = require("../config/constant");

const checkLogin = (allowedRoles = null) => {
  return async (req, res, next) => {
    try {
      let token = req.headers["authorization"] || null;
      let sessionId = req.cookies?.sessionId;
      let userDetail = null;
      let sessionData = null;

      if (sessionId) {
        sessionData = await authSvc.getSingleRowByFilter({ _id: sessionId });
        if (sessionData) {
          userDetail = await userSvc.getSingleRowByFilter({ _id: sessionData.user });
          if (!userDetail) {
            throw {
              code: 403,
              message: "User was deleted or does not exist",
              status: "USER_NOT_FOUND",
            };
          }
          req.loggedInUser = userDetail;
          if (
            userDetail.role === UserRoles.ADMIN ||
            !allowedRoles ||
            allowedRoles.includes(userDetail.role)
          ) {
            req.user = userDetail;
            return next();
          } else {
            throw {
              code: 403,
              message: "You are not authorized to access this resource",
              status: "PERMISSION_DENIED",
            };
          }
        }
      }
      if (!token) {
        throw {
          code: 401,
          message: "Unauthenticated",
          status: "UNAUTHENTICATED_ERR",
        };
      }
      token = token.replace("Bearer ", "").trim();
      let payload;
      try {
        payload = jwt.verify(token, AppConfig.jwtSecret);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw {
            code: 401,
            message: "Token expired",
            status: "TOKEN_EXPIRED",
          };
        } else {
          throw {
            code: 401,
            message: "Invalid token",
            status: "INVALID_TOKEN",
          };
        }
      }
      if (payload.type !== "Bearer") {
        throw {
          code: 401,
          message: "Invalid token type",
          status: "INVALID_TOKEN_TYPE",
        };
      }
      sessionData = await authSvc.getSingleRowByFilter({
        user: payload.sub,
        "token.access": token,
      });
      if (!sessionData) {
        throw {
          code: 401,
          message: "Session Not Found",
          status: "SESSION_NOT_FOUND",
        };
      }
      userDetail = await userSvc.getSingleRowByFilter({
        _id: payload.sub,
      });
      if (!userDetail) {
        throw {
          code: 403,
          message: "User was deleted or does not exist",
          status: "USER_NOT_FOUND",
        };
      }
      req.loggedInUser = userDetail;
      if (
        userDetail.role === UserRoles.ADMIN ||
        !allowedRoles ||
        allowedRoles.includes(userDetail.role)
      ) {
        req.user = userDetail;
        next();
      } else {
        throw {
          code: 403,
          message: "You are not authorized to access this resource",
          status: "PERMISSION_DENIED",
        };
      }
    } catch (exception) {
      next(exception);
    }
  };
};

module.exports = checkLogin;
