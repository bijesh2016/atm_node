const mongoose = require("mongoose");
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
    unique: true,
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
  branch:[{
    type:String,
    min:3,
    max:100,
    required:true
  }]
});

const AtmModel = mongoose.model("Atm", AtmSchema);
module.exports = AtmModel;
