const authRouter=require("express").Router()
const authCtrl=require("./auth.controller")


authRouter.post("/register",authCtrl.registerUser)


module.exports=authRouter