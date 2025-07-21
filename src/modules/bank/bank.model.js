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
  code: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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
  image:{
    publicId: String,
    url: String,
    thumbUrl: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // views: {
  //   type: Number,
  //   default: 0,
  // },
}, {
  timestamps: true
});

const BankModel = mongoose.model("Bank", BankSchema);
module.exports = BankModel;
