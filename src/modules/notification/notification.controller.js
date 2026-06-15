const NotificationModel = require('./notification.model');

exports.createNotification = async (req, res) => {
  try {
    const notification = new NotificationModel(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await NotificationModel.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await NotificationModel.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
