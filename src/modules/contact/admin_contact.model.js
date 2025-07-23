const mongoose = require('mongoose');

const adminContactSchema = new mongoose.Schema({
  email:
  {
    type: String,
    required: true
  },
  phone:
  {
    type: String,
    required: true
  },
  address:
  {
    type: String,
    required: true
  },
  website:
  {
    type: String
  },
  updatedAt:
  {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminContact', adminContactSchema); 