const { string } = require("joi")
const mongoose=require("mongoose")
const ReviewSchema=new mongoose.Schema({
    name:{
        type:string,
        min:3,
        max:250,
        required:true
    },

    email:{
        type:String,
        required:true,
    },
    message:{
        min:5,
        max:500,
        type:String
    },
    timestamps:true,
    autoCreate:true,
    autoIndex:true,
})

const ReviewModel=mongoose.model("Review",ReviewSchema)
module.exports=ReviewModel