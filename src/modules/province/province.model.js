const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const ProvinceModel = mongoose.model('Province', ProvinceSchema);
module.exports = ProvinceModel; 