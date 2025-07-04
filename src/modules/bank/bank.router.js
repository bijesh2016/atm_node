const express = require('express');
const bankRouter = express.Router();
const bankCtrl=require("./bank.controller");

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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of banks
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
 *     responses:
 *       200:
 *         description: Bank detail
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
 *     responses:
 *       200:
 *         description: Bank updated
 */
bankRouter.put('/:id',bankCtrl.bankUpdateById);

/**
 * @swagger
 * /bank/{id}:
 *   delete:
 *     summary: Delete bank by id
 *     tags: [Bank] 
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
*         description: Bank created
*/ 
bankRouter.post('/',bankCtrl.createBank);

module.exports =bankRouter;
