const authRouter=require("express").Router()
const checkLogin = require("../../middlewares/auth.middleware")
const bodyValidator = require("../../middlewares/validator.middleware")
const authCtrl=require("./auth.controller")
const {registerUserDTD,LoginDTD}=require("./auth.validator")
// const uploader=require("../../middlewares/file-upload.middleware")

authRouter.post("/register",bodyValidator(registerUserDTD),authCtrl.registerUser)
authRouter.get("/activate/:token",authCtrl.activateUserProfile)

authRouter.post("/login",checkLogin(LoginDTD),authCtrl.login)
authRouter.post("/me",checkLogin,authCtrl.getLoggedInUserProfile)
authRouter.patch("/logout",checkLogin,authCtrl.logout)

module.exports=authRouter
