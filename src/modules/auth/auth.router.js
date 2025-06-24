const authRouter=require("express").Router()
const authCtrl=require("./auth.controller")
const {registerUserDTD}=require("./auth.validator")

authRouter.post("/register",authCtrl.registerUser)
authRouter.get("/activate/:token",authCtrl.activateUserProfile)

authRouter.post("/login",authCtrl.login)
authRouter.post("/me",authCtrl.getLoggedInUserProfile)
authRouter.patch("/logout",authCtrl.logout)

module.exports=authRouter
