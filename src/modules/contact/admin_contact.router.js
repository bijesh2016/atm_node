const express = require('express');
const router = express.Router();
const adminContactController = require('./admin_contact.controller');
const { isAdmin } = require('../auth/authentication');

router.get('/', isAdmin, adminContactController.getContactInfo);
router.put('/', isAdmin, adminContactController.updateContactInfo);

module.exports = router; 