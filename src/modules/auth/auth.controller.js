class authController{
    registerUser=async((req,res,next)=>{
        res.json({
            data:null,
            msz:'registration success',
            status:"REGISTRATION_SUCCESSFUL",
            option:null
        })
    })
    
}

const authCtrl=new AuthController()
module.exports=authCtrl
