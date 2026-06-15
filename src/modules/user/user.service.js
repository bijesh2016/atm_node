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

    async updateUser(userId, updateData) {
        try {
            const user = await UserModel.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (exception) {
            console.error('Error updating user:', exception);
            throw exception;
        }
    }


 transformUserRegister = async (req) => {
  const { name, email, password, phone, gender, address, role, status,image } = req.body;
  const data = {
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    phone,
    gender,
    address,
    role: role || 'user', 
    status: status || 'inactive', 
    image,
    activationToken: randomStringGenerate(15),
    expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000), 
  };
  if (req.file) {
    data.image = req.file.path; 
  }
  return data;
};

}
const userSvc=new UserService()
module.exports=userSvc