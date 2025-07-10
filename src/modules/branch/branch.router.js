const express = require('express');
const branchRouter = express.Router();
const branchCtrl=require('./branch.controller')

/**
 * @swagger
 * /branch:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of branches for home
 */
branchRouter.get('for-home',branchCtrl.branchForHome);

/**
 * @swagger
 * /branch:
 *   get:
 *     summary: Get all branches
 *     tags: [Branch]
 *     responses:
 *       200:
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Branch'
 */
branchRouter.get('/',branchCtrl.listAllBranch);

/**
 * @swagger
 * /branch/{id}:
 *   get:
 *     summary: Get branch detail by id
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
branchRouter.get('/:id',branchCtrl.branchDetailById);

/**
 * @swagger
 * /branch/{id}:
 *   put:
 *     summary: Update branch by id
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Branch ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: Branch updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */
branchRouter.put('/:id',branchCtrl.branchUpdateById);

/**
 * @swagger
 * /branch/{id}:
 *   delete:
 *     summary: Delete branch by id
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch deleted
 */ 
branchRouter.delete('/:id',branchCtrl.branchDeleteById);

/**
 * @swagger
 * /branch/atms/{id}:
 *   get:
 *     summary: Get atms by branch id
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Atms by branch id
 */ 
branchRouter.get('/atms/:id',branchCtrl.atmsByBranchId);

/**
 * @swagger
 * /branch:
 *   post:
 *     summary: Create a new branch
 *     tags: [Branch]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Branch'
 *     responses:
 *       200:
 *         description: Branch created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Branch'
 */ 
branchRouter.post('/',branchCtrl.createBranch);


module.exports = branchRouter;
