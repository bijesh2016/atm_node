const { mongoose } = require("mongoose");
const {Status}=require("../../config/constant")
const BranchSchema = new mongoose.Schema({
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
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  services: [
    {
      type: String,
      required: true,
    },
  ],
  address: {
    type: String,
    required: true,
  },
  phone: String,
  manager: {
    type: String,
    required: false,
    default: null,
  },
  email: {
    type: String,
    required: false,
    default: null,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
  province: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: false,
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
  }
}, {
  timestamps: true
});

const BranchModel = mongoose.model("Branch", BranchSchema);
module.exports = BranchModel;
