const userSvc = require("../../modules/user/user.service");
const authSvc = require("./auth.service");
const authMailSvc = require("./auth.mail");
const {AppConfig}=require("../../config/config");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const EmailSvc=require("../../services/mail.service");
const {randomStringGenerate}=require("../../utilities/helpers");
const {Status}=require("../../config/constant");
const uploader=require("../../middlewares/file-upload.middleware");
class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const { password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Password and confirm password do not match.",
          status: "PASSWORD_MISMATCH"
        });
      }
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
        userDetail.activationToken = randomStringGenerate(15);
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
          message: "User not registered yet",
          status: "USER_NOT_REGISTERED_YET",
        } 
      }
      //bcrypt
      const isPasswordValid = bcrypt.compareSync(password, userInfo.password);
      if (!isPasswordValid) {
        throw {
          code: 422,
          message: "Credentials do not match",
          status: "CREDENTIALS_DONOT_MATCH",
        };
      }                 

      if(userInfo.status!== Status.ACTIVE||userInfo.activationToken!==null){
        throw{  
          code:422,
          message:"Account not activated yet",
          status:"NOT_ACTIVATED"
        }
      }               
      //jwt token 
      const accessToken = jwt.sign(
        {
          sub: userInfo._id,
          type: "Bearer",
        },
        AppConfig.jwtSecret,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        {
          sub: userInfo._id,
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
      const sessionRecord = await authSvc.storeSession(sessionData);

      req.session.userId = userInfo._id;
      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;
      req.session.sessionId = sessionRecord._id;


      res.cookie('sessionId', sessionRecord._id.toString(), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, 
        sameSite: 'lax',
      });
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

  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await userSvc.getSingleRowByFilter({ email });
      if (!user) {
        throw {
          code: 404,
          message: "User not found",
          status: "USER_NOT_FOUND",
        };
      }

      // Generate reset token and expiry
      const resetToken = randomStringGenerate(15);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      
      await user.save();
      await authMailSvc.notifyPasswordReset(user); 

      res.json({
        data: {},
        message: "Password reset link generated.",
        status: "FORGOT_PASSWORD_SUCCESS",
        option: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      console.log("")
      const userId = req.loggedInUser._id;
      const { oldPassword, newPassword } = req.body;
      const user = await userSvc.getSingleRowByFilter({ _id: userId });
      if (!user) {
        throw {
          code: 404,
          message: "User not found",
          status: "USER_NOT_FOUND",
        };
      }
      const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
      if (!isPasswordValid) {
        throw {
          code: 422,
          message: "Old password is incorrect",
          status: "OLD_PASSWORD_INCORRECT",
        };
      }
      user.password = bcrypt.hashSync(newPassword, 10);
      await user.save();
      res.json({
        data: {},
        message: "Password changed successfully.",
        status: "CHANGE_PASSWORD_SUCCESS",
        option: null,
      });
    } catch (exception) {
      next(exception);
    }
  };


  logout = async (req, res, next) => {
    try {
      const loggedInUser = req.loggedInUser;
      let filter = {};
      let sessionId = req.cookies?.sessionId;
      if (req.query.logoutFromAll) {
        filter = {
          user: loggedInUser._id,
        };
      } else if (sessionId) {
        filter = {
          _id: sessionId,
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
      res.clearCookie('sessionId');
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
