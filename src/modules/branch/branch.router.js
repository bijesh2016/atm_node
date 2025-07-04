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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of branches
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
 *     responses:
 *       200:
 *         description: Branch detail
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
 *     responses:
 *       200:
 *         description: Branch updated
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
 *     responses:
 *       200:
*         description: Branch created
*/ 
branchRouter.post('/',branchCtrl.createBranch);


module.exports = branchRouter;
