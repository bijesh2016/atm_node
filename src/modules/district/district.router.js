const express = require('express');
const districtController = require('./district.controller');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     District:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: District ID
 *         name:
 *           type: string
 *           description: District name
 *         province:
 *           $ref: '#/components/schemas/Province'
 *
 * /district:
 *   get:
 *     summary: Get all districts (optionally filter by provinceId)
 *     tags: [District]
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: string
 *         required: false
 *         description: Province ID to filter districts
 *     responses:
 *       200:
 *         description: List of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/District'
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 */
router.get('/', districtController.getAllDistricts);

module.exports = router; 