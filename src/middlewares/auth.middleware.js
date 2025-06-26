const authSvc = require("../modules/auth/auth.service");
const userSvc = require("../modules/user/user.service");
const jwt = require("jsonwebtoken");
const { AppConfig } = require("../config/config");
const { UserRoles } = require("../config/constant");

const checkLogin = (allowedRoles = null) => {
    return async (req, res, next) => {
        try {
            let token = req.headers['authorization'] || null;

            if (!token) {
                throw {
                    code: 401,
                    message: "Unauthenticated",
                    status: "UNAUTHENTICATED_ERR",
                };
            }

            token = token.replace("Bearer ", "");


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

            req.loggedInUser = userDetail;

            if (userDetail.role === UserRoles.ADMIN || !allowedRoles || allowedRoles.includes(userDetail.role)) {
                req.user = userDetail;
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

module.exports = checkLogin;