const { mongoose } = require("mongoose");

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    max: 250,
    required: true,
  },
  // location: {
  //   type: {
  //     type: String,
  //     enum: ["Point"],
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //   },
  // },
   slug: {
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
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
});

const BranchModel = mongoose.model("Branch", BranchSchema);
module.exports = BranchModel;
