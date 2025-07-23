const Contact = require('./contact.model');

class ContactService {
    async createContact(contactData) {
        try {
            const contact = new Contact(contactData);
            return await contact.save();
        } catch (error) {
            throw error;
        }
    }

    async getAllContacts() {
        try {
            return await Contact.find().sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(contactId) {
        try {
            return await Contact.findByIdAndUpdate(
                contactId,
                { status: 'read' },
                { new: true }
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteContact(contactId) {
        try {
            return await Contact.findByIdAndDelete(contactId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ContactService(); 