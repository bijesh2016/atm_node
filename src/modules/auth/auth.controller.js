const userSvc = require("../../modules/user/user.service");
const authSvc = require("./auth.service");
const authMailSvc = require("../../services/mail.service");
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
        option: null
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
        option: null
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
          status: "USER_DOES_NOT_EXISTS"
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
          option: null
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

  login=async(req,res,next)=>{
    res.json({
        data:null,
        message:"Login Successful",
        status:"LOGIN SUCCESSFUL",
        option:null,
    })
  }

logout=async(req,res,next)=>{
    res.json({
        data:null,
        message:"Logout Successful",
        status:"LOGOUT SUCCESSFUL",
        option:null
    })
}



}

const authCtrl = new AuthController();
module.exports = authCtrl;
