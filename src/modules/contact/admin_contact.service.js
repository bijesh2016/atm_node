const AdminContact = require('./admin_contact.model');

class AdminContactService {
  async getContactInfo() {
    let info = await AdminContact.findOne();
    if (!info) {
      info = await AdminContact.create({
        email: '',
        phone: '',
        address: '',
        website: ''
      });
    }
    return info;
  }

  async updateContactInfo(data) {
    let info = await AdminContact.findOne();
    if (!info) {
      info = await AdminContact.create(data);
    } else {
      Object.assign(info, data, { updatedAt: new Date() });
      await info.save();
    }
    return info;
  }
}

module.exports = new AdminContactService(); 