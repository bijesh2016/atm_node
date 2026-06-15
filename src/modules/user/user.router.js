const express = require('express');
const router = express.Router();
const uploader = require('../../middlewares/file-upload.middleware');
const userSvc = require('./user.service');
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

router.post('/upload-profile-image/:userId', uploader('image').single('image'), async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageUrl = `/public/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        image: {
          publicId: req.file.filename,
          url: imageUrl,
          thumbUrl: imageUrl 
        }
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      message: 'Profile image updated',
      image: user.image
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

module.exports = router; 