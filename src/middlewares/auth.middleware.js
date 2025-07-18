const authSvc = require("../modules/auth/auth.service");
const userSvc = require("../modules/user/user.service");
const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/config");
const { UserRoles } = require("../config/constant");

const checkLogin = (allowedRoles = null) => {
  return async (req, res, next) => {
    try {
      let token = req.headers["authorization"] || null;

       if (!token) {
                throw {
                    code: 401,
                    message: "Unauthenticated",
                    status: "UNAUTHENTICATED_ERR",
                };
            }

            // Remove "Bearer " prefix
            token = token.replace("Bearer ", "");

            // Check if session exists for this token
            const sessionData = await authSvc.getSingleRowByFilter({
                "token.access": token
            });

            if (!sessionData) {
                throw {
                    code: 401,
                    message: "Session Not Found",
                    status: "SESSION_NOT_FOUND"
                };
            }

            // Verify token and extract payload
            const payload = jwt.verify(token, AppConfig.jwtSecret);

            if (payload.type !== 'Bearer') {
                throw {
                    code: 401,
                    message: "Invalid token type",
                    status: "INVALID_TOKEN_TYPE"
                };
            }

            const userDetail = await userSvc.getSingleRowByFilter({
                _id: payload.sub
            });

            if (!userDetail) {
                throw {
                    code: 403,
                    message: "User was already deleted or does not exist anymore",
                    status: "USER_NOT_FOUND"
                };
            }

            // Set loggedInUser for use in controllers
            req.loggedInUser = userDetail;

            // Role-based access control
            if (userDetail.role === UserRoles.ADMIN || !allowedRoles || allowedRoles.includes(userDetail.role)) {
                req.user = userDetail; // Optional: pass user info forward
                next();
            } else {
                throw {
                    code: 403,
                    message: "You are not authorized to access this resource",
                    status: "PERMISSION_DENIED"
                };
            }

        } catch (exception) {
            let error = exception;

            if (exception instanceof jwt.TokenExpiredError) {
                error.code = 401;
                error.status = "TOKEN_EXPIRED";
            }

            next(error);
        }
    };
};









//       let sessionId = req.session?.sessionId || req.cookies?.sessionId;
//       let userDetail = null;
//       let sessionData = null;
//       // 1. Check session/cookie first
//       if (sessionId) {
//         sessionData = await authSvc.getSingleRowByFilter({ _id: sessionId });
//         if (sessionData) {
//           userDetail = await userSvc.getSingleRowByFilter({ _id: sessionData.user });
//           if (!userDetail) {
//             throw {
//               code: 403,
//               message: "User was deleted or does not exist",
//               status: "USER_NOT_FOUND",
//             };
//           }
//           req.loggedInUser = userDetail;
//           if (
//             userDetail.role === UserRoles.ADMIN ||
//             !allowedRoles ||
//             allowedRoles.includes(userDetail.role)
//           ) {
//             req.user = userDetail;
//             return next();
//           } else {
//             throw {
//               code: 403,
//               message: "You are not authorized to access this resource",
//               status: "PERMISSION_DENIED",
//             };
//           }
//         }
//       }
//       // 2. Fallback to JWT
//       if (!token) {
//         throw {
//           code: 401,
//           message: "Unauthenticated",
//           status: "UNAUTHENTICATED_ERR",
//         };
//       }
//       token = token.replace("Bearer ", "").trim();
//       let payload;
//       try {
//         payload = jwt.verify(token, AppConfig.jwtSecret);
//       } catch (err) {
//         if (err.name === "TokenExpiredError") {
//           throw {
//             code: 401,
//             message: "Token expired",
//             status: "TOKEN_EXPIRED",
//           };
//         } else {
//           throw {
//             code: 401,
//             message: "Invalid token",
//             status: "INVALID_TOKEN",
//           };
//         }
//       }
//       if (payload.type !== "Bearer") {
//         throw {
//           code: 401,
//           message: "Invalid token type",
//           status: "INVALID_TOKEN_TYPE",
//         };
//       }
//       sessionData = await authSvc.getSingleRowByFilter({
//         user: payload.sub,
//         "token.access": token,
//       });
//       if (!sessionData) {
//         throw {
//           code: 401,
//           message: "Session Not Found",
//           status: "SESSION_NOT_FOUND",
//         };
//       }
//       userDetail = await userSvc.getSingleRowByFilter({
//         _id: payload.sub,
//       });
//       if (!userDetail) {
//         throw {
//           code: 403,
//           message: "User was deleted or does not exist",
//           status: "USER_NOT_FOUND",
//         };
//       }
//       req.loggedInUser = userDetail;
//       if (
//         userDetail.role === UserRoles.ADMIN ||
//         !allowedRoles ||
//         allowedRoles.includes(userDetail.role)
//       ) {
//         req.user = userDetail;
//         next();
//       } else {
//         throw {
//           code: 403,
//           message: "You are not authorized to access this resource",
//           status: "PERMISSION_DENIED",
//         };
//       }
//     } catch (exception) {
//       next(exception);
//     }
//   };
// };

module.exports = checkLogin;
