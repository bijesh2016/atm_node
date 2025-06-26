const userSvc = require("../../modules/user/user.service");
const authSvc = require("./auth.service");
const authMailSvc = require("./auth.mail");
const {AppConfig}=require("../../config/config")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const EmailSvc=require("../../services/mail.service")

const uploader=require("../../middlewares/file-upload.middleware")
class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const data = await userSvc.transformUserRegister(req);
      const user = await userSvc.userRegister(data);

      await authMailSvc.notifyUserRegistration(user);
      res.json({
        data: user,
        message: "Your account has been registered successfully",
        status: "SUCCESS",
        option: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getLoggedInUserProfile = (req, res, next) => {
    try {
      const user = req.loggedInUser;
      const userProfile = userSvc.getUserPublicProfile(user);
      res.json({
        data: userProfile,
        message: "Your Profile",
        status: "OK",
        option: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  activateUserProfile = async (req, res, next) => {
    try {
      let token = req.params.token;
      const userDetail = await userSvc.getSingleRowByFilter({
        activationToken: token,
      });

      if (!userDetail) {
        throw {
          code: 422,
          message: "User not found",
          status: "USER_DOES_NOT_EXISTS",
        };
      }
      //expiry
      let expiryTime = userDetail.expiryTime.getTime();
      let todayTime = Date.now();

      if (todayTime > expiryTime) {
        userDetail.activationToken = randomStringGenerate(150);
        userDetail.expiryTime = new Date(Date.now() + 60 * 60 * 3 * 1000);
        await userDetail.save();
        await authMailSvc.notifyUserRegistration(userDetail);
        res.json({
          data: null,
          message:
            "A new verification link has been sent to your registered account",
          status: "RESENT_VERIFICATION_LINK",
          option: null,
        });
      } else {
        userDetail.activationToken = null;
        userDetail.expiryTime = null;
        userDetail.status = Status.ACTIVE;
        await userDetail.save();
        await authMailSvc.notifyActivationSuccess(userDetail);
        res.json({
          data: null,
          message:
            "Your account has been activated successfully. please Login to continue...",
          status: "RESENT_VERIFICATION_LINK",
          options: null,
        });
      }
    } catch (exception) {
      next(exception);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userInfo = await userSvc.getSingleRowByFilter({
        email: email,
      });
      if (!userInfo) {
        throw {
          code: 422,
          message: "Credientials doesnot match",
          status: "CREDIENTIALS_DOESNOT_MATCH",
        };
      }
      if (
        userInfo.status !== Status.ACTIVE ||
        userInfo.activationToken != null
      ) {
        throw {
          code: 422,
          message: "Account not activated yet",
          status: "ACCOUNT_NOT_ACTIVATED_YET",
        };
      }

      // Verify password
      const isPasswordValid = bcrypt.compareSync(password, userInfo.password);
      if (!isPasswordValid) {
        throw {
          code: 422,
          message: "Credentials do not match",
          status: "CREDENTIALS_DONOT_MATCH",
        };
      }

      //jwt token
      const accessToken = jwt.sign(
        {
          sub: userInfo.id,
          type: "Bearer",
        },
        AppConfig.jwtSecret,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        {
          sub: userInfo.id,
          type: "Refresh",
        },
        AppConfig.jwtSecret,
        { expiresIn: "5d" }
      );

      let sessionData = {
        user: userInfo._id,
        token: {
          access: accessToken,
          refresh: refreshToken,
        },
        accessDevice: "web",
        ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      };
      await authSvc.storeSession(sessionData);
      res.json({
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        message: "Login Successful",
        status: "LOGIN_SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  logout = async (req, res, next) => {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {};
      if (req.query.logoutFromAll) {
        filter = {
          user: loggedInUser._id,
        };
      } else {
        const token = req.headers["authorization"]?.replace("Bearer ", "");
        filter = {
          user: loggedInUser._id,
          "token.access": token,
        };
      }

      await authSvc.destroySession(filter);
      res.json({
        message: "Logged out successfully",
        status: "LOGOUT_SUCCESSFUL",
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
