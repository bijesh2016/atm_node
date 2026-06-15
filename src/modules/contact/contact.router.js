const express = require('express');
const router = express.Router();
const contactController = require('./contact.controller');
const { isAdmin } = require('../auth/authentication');

router.post('/', contactController.createContact);

router.get('/', isAdmin, contactController.getAllContacts);
router.patch('/:id/mark-read', isAdmin, contactController.markAsRead);
router.delete('/:id', isAdmin, contactController.deleteContact);

module.exports = router; 