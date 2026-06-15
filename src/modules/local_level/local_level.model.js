const mongoose = require('mongoose');

const LocalLevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: Number,
    required: true,
  },
  total_wards: {
    type: Number,
    required: true,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
    required: true,
  },
});

const LocalLevelModel = mongoose.model('LocalLevel', LocalLevelSchema);
module.exports = LocalLevelModel; 