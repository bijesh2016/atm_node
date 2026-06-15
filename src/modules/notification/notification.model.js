const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  user: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.nows
  }
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);
module.exports = NotificationModel;
