const adminContactService = require('./admin_contact.service');

class AdminContactController {
  async getContactInfo(req, res) {
    try {
      const info = await adminContactService.getContactInfo();
      res.json({ success: true, data: info });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateContactInfo(req, res) {
    try {
      const info = await adminContactService.updateContactInfo(req.body);
      res.json({ success: true, data: info });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminContactController(); 