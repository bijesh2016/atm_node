const express = require('express');
const localLevelController = require('./local_level.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LocalLevel:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Local level ID
 *         name:
 *           type: string
 *           description: Local level name
 *         code:
 *           type: number
 *           description: Local level code
 *         total_wards:
 *           type: number
 *           description: Total number of wards
 *         district:
 *           $ref: '#/components/schemas/District'
 *
 * /local_level:
 *   get:
 *     summary: Get all local levels (optionally filter by districtId)
 *     tags: [LocalLevel]
 *     parameters:
 *       - in: query
 *         name: districtId
 *         schema:
 *           type: string
 *         required: false
 *         description: District ID to filter local levels
 *     responses:
 *       200:
 *         description: List of local levels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LocalLevel'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.get('/', localLevelController.getAllLocalLevels);

module.exports = router; 