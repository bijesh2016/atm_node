const express = require('express');
const router = express.Router();
const adminUserService = require('./admin.user.service');
const { verifyAdmin } = require('../../middlewares/auth.middleware');
const { Status } = require('../../config/constant');
const { createError } = require('../../utilities/errorHandler');

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users with pagination and search
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for email or name
 *     responses:
 *       200:
 *         description: List of users with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   $ref: '#/components/schemas/Pagination'
 */
// Get all users with pagination and search
router.get('/users', 
  verifyAdmin, 
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      
      // Validate pagination parameters
      const pageNumber = Math.max(1, parseInt(page) || 1);
      const limitNumber = Math.min(100, Math.max(1, parseInt(limit) || 10));
      
      const result = await adminUserService.listUsers({ 
        page: pageNumber, 
        limit: limitNumber, 
        search: search.toString()
      });
      
      res.json({
        success: true,
        data: result.data,
        meta: result.meta
      });
    } catch (error) {
      console.error('Error in GET /admin/users:', error);
      next(createError(500, 'Failed to fetch users', error.message));
    }
  }
);

/**
 * @swagger
 * /admin/users/{userId}/status:
 *   put:
 *     summary: Update user status (active/suspended)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended]
 *                 description: New status for the user
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
// Update user status (active/inactive)
router.put('/users/:userId/status', 
  verifyAdmin, 
  async (req, res, next) => {
    try {
      console.log('[Backend] Received status update request:', {
        params: req.params,
        body: req.body,
        headers: req.headers
      });
      
      const { userId } = req.params;
      const { status } = req.body;
      
      console.log('[Backend] Validating status:', status);
      console.log('[Backend] Available statuses:', { ACTIVE: Status.ACTIVE, INACTIVE: Status.INACTIVE });
      
      if (!status) {
        console.error('[Backend] Status is required');
        return next(createError(400, 'Status is required'));
      }
      
      if (![Status.ACTIVE, Status.INACTIVE].includes(status)) {
        const errorMsg = `Invalid status: "${status}". Must be either "${Status.ACTIVE}" or "${Status.INACTIVE}"`;
        console.error('[Backend]', errorMsg);
        return next(createError(400, errorMsg));
      }
      
      console.log(`[Backend] Updating user ${userId} status to ${status}`);
      const user = await adminUserService.updateUserStatus(userId, status);
      
      console.log(`[Backend] Successfully updated user ${userId} status to ${status}`);
      res.json({
        success: true,
        message: `User ${status === Status.ACTIVE ? 'activated' : 'deactivated'} successfully`,
        data: user
      });
    } catch (error) {
      console.error('Error in PUT /admin/users/:userId/status:', error);
      next(createError(
        error.message.includes('not found') ? 404 : 500,
        error.message || 'Failed to update user status'
      ));
    }
  }
);

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Soft delete a user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
// Soft delete a user
router.delete('/users/:userId', 
  verifyAdmin, 
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      // Prevent deleting self
      if (userId === req.user.id) {
        return next(createError(400, 'You cannot delete your own account'));
      }
      
      const user = await adminUserService.deleteUser(userId);
      
      res.json({ 
        success: true, 
        message: 'User deleted successfully',
        data: user
      });
    } catch (error) {
      console.error('Error in DELETE /admin/users/:userId:', error);
      next(createError(
        error.message.includes('not found') ? 404 : 500,
        error.message || 'Failed to delete user'
      ));
    }
  }
);

module.exports = router;
