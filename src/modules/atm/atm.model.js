const mongoose = require("mongoose");
const {Status}=require("../../config/constant")
const AtmSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 250,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
   slug: {
      type: String,
      required: true,
      unique: true,
    },

  latitude:{
    type: Number,
    required: true,
  },
  longitude:{
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  phone: String,
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
  branch:[{
    type:String,
    min:3,
    max:100,
    required:true,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

const AtmModel = mongoose.model("Atm", AtmSchema);
module.exports = AtmModel;
