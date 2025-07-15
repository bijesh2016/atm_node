const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province',
    required: true,
  },
});

const DistrictModel = mongoose.model('District', DistrictSchema);
module.exports = DistrictModel; 