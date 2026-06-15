const contactService = require('./contact.service');

class ContactController {
    createContact = async (req, res) => {
        try {
            const contact = await contactService.createContact(req.body);
            res.status(201).json({
                success: true,
                message: 'Contact message sent successfully',
                data: contact
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error sending contact message',
                error: error.message
            });
        }
    }

    getAllContacts = async (req, res) => {
        try {
            const contacts = await contactService.getAllContacts();
            res.status(200).json({
                success: true,
                data: contacts
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching contacts',
                error: error.message
            });
        }
    }

    markAsRead = async (req, res) => {
        try {
            const contact = await contactService.markAsRead(req.params.id);
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Contact marked as read',
                data: contact
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating contact',
                error: error.message
            });
        }
    }

    deleteContact = async (req, res) => {
        try {
            const contact = await contactService.deleteContact(req.params.id);
            if (!contact) {
                return res.status(404).json({
                    success: false,
                    message: 'Contact not found'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Contact deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting contact',
                error: error.message
            });
        }
    }
}

module.exports = new ContactController(); 