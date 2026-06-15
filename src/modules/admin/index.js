const express = require('express');
const adminUserRouter = require('./admin.user.router');

const router = express.Router();

// Mount admin user routes
router.use('/admin', adminUserRouter);

module.exports = router;
