const fileUploadSvc=require("../../services/fileupload.service")
const bcrypt=require("bcryptjs")
const {randomStringGenerate}=require("../../utilities/helpers")
const {Status}=require("../../config/constant")
const UserModel = require("./user.model")

class UserService{
   async transformUserRegister(req){
    try{
        const data=req.body
        if(req.file){
        data.file=await fileUploadSvc.uploadFile(req.file.path,"/users");
        }
        data.password=bcrypt.hashSync(data.password,12)
        data.activationToken=randomStringGenerate(15)
        data.expiryTime=new Date(Date.now()+3600000)
        data.status=Status.ACTIVE

        return data;


    }catch(exception){
        throw exception
    }
    }
    async userRegister(data){
        try{
            const user=new UserModel(data)
            return await user.save()
        }catch(exception){
            throw exception
        }
    }

    async getSingleRowByFilter(filter){
        try{
            const UserDetail=await UserModel.findOne(filter)
            return UserDetail
        }catch(exception){
            throw(exception)
        }

    }

    getUserPublicProfile(user){
        return{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            gender:user.gender,
            address:user.address,
            dob:user.dob,
            phone:user.phone,
            status:user.status,
            image:user?.image?.thumbUrl,
        }
    }


}
const userSvc=new UserService()
module.exports=userSvc