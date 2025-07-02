const { mongoose } = require("mongoose");
const {Status}=require("../../config/constant")
const BankSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 250,
    required: true,
  },
   slug: {
      type: String,
      required: true,
      unique: true,
    },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  longitude: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    length: 10,
    type: Number,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
  branch: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
});

const BankModel = mongoose.model("Bank", BankSchema);
module.exports = BankModel;
