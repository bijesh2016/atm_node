const express = require('express');
const bankRouter = express.Router();
const bankCtrl=require("./bank.controller");
const uploader = require('../../middlewares/file-upload.middleware');
const bodyValidator = require('../../middlewares/validator.middleware');
const {AddBankDTD}=require("../../modules/bank/bank.validator")

/**
 * @swagger
 * /bank:
 *   get:
 *     summary: Get all banks
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
    *     responses:
 *       200:
 *         description: List of banks
 */
bankRouter.get("/for-home",bankCtrl.banksForHome);

/**
 * @swagger
 * /bank:
 *   get:
 *     summary: Get all banks
 *     tags: [Bank]
 *     responses:
 *       200:
 *         description: List of banks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bank'
 */
bankRouter.get('/',bankCtrl.listAllBank);

/**
 * @swagger
 * /bank/{id}:
 *   get:
 *     summary: Get bank detail by id
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bank ID
 *     responses:
 *       200:
 *         description: Bank detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 */
bankRouter.get('/:id',bankCtrl.bankDetailById);

/**
 * @swagger
 * /bank/{id}:
 *   put:
 *     summary: Update bank by id
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bank ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bank'
 *     responses:
 *       200:
 *         description: Bank updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 */
bankRouter.put('/:id',uploader('single').single('image'),bodyValidator(AddBankDTD),bankCtrl.bankUpdateById);

/**
 * @swagger
 * /bank/{id}:
 *   delete:
 *     summary: Delete bank by id
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bank ID
 *     responses:
 *       200:
 *         description: Bank deleted
 */
bankRouter.delete('/:id',bankCtrl.bankDeleteById);

/**
 * @swagger
 * /bank/branches/{slug}:
 *   get:
 *     summary: Get bank branches by slug
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank branches
 */
bankRouter.get('/branches/:slug',bankCtrl.branchesByBankSlug);     

/**
 * @swagger
 * /bank:
 *   post:
 *     summary: Create a new bank
 *     tags: [Bank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bank'
 *     responses:
 *       200:
 *         description: Bank created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bank'
 */
bankRouter.post('/',bankCtrl.createBank);

module.exports =bankRouter;
