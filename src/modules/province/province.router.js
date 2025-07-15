const express = require('express');
const provinceController = require('./province.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Province:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Province ID
 *         name:
 *           type: string
 *           description: Province name
 *
 * /province:
 *   get:
 *     summary: Get all provinces
 *     tags: [Province]
 *     responses:
 *       200:
 *         description: List of provinces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Province'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.get('/', provinceController.getAllProvinces);

module.exports = router; 