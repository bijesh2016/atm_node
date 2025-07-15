const express = require('express');
const router = express.Router();
const User = require('./user.model');

/**
 * @swagger
 * /user/count:
 *   get:
 *     summary: Get total number of users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Total number of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of users
 */
// GET /users/count - returns the total number of users
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user count' });
  }
});

module.exports = router; 