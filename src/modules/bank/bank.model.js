const {mongoose} = require("mongoose");

const BankSchema=new mongoose.Schema({
    name:{
        type:String,
        min:3,
        max:250,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
  location: {
    type: {
      type: String,
      enum: ["Point"], 
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
    address:{
        type:String,
        required:true,
    },
    phone:{
        length:10,
        type:Number,
    },
    website:{
        type:String,
    }
})

const BankModel=mongoose.model("Bank",BankSchema)
module.exports=BankModel