const mongoose=require("mongoose")
const ReviewSchema=new mongoose.Schema({
    name:{
        type:String,
        min:3,
        max:250,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        min:5,
        max:500,
        required:true
    }
}, {
    timestamps:true,
    autoCreate:true,
    autoIndex:true
});

const ReviewModel=mongoose.model("Review",ReviewSchema)
module.exports=ReviewModel