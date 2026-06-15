const mongoose=require("mongoose")
const { UserRoles, Status } = require("../../config/constant")

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        min:3,
        max:250,
        required:true
    },        
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:Object.values(UserRoles),
        default:UserRoles.USER
    },
    gender:{
        type:String,
        enum:["male", "female", "others"],
        required:true
    },
    address:{
        type:String,
        default: ''
    },
    dob:{
        type:Date
    },
    image:{
        publicId:String,
        url:String,
        thumbUrl:String
    },
    status:{
        type:String,
        enum:Object.values(Status),
        default:Status.INACTIVE
    },
    activationToken:String,
    expiryTime:Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: {
        type: Date,
        default: null
    }
},{
    timestamps: true,
    autoCreate:true,
    autoIndex:true
})
const UserModel=mongoose.model("User",UserSchema)
module.exports=UserModel