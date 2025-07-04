const express = require('express');
const atmRouter = express.Router();
const atmCtrl = require("./atm.controller");

/**
 * @swagger
 * /atm:
 *   get:
 *     summary: Get all ATMs
 *     tags: [ATMs]
 *     responses:
 *       200:
 *         description: List of ATMs
 */
// atmRouter.post('/',atmCtrl.createAtm);     

/**
 * @swagger
 * /atm/for-home:
 *   get:
 *     summary: Get ATMs for home
 *     tags: [ATMs]
 *     responses:
 *       200:
 *         description: List of ATMs for home
 */
atmRouter.get('/for-home', atmCtrl.atmsForHome);
/**
 * @swagger
 * /ATM/branches/{slug}:
 *   get:
 *     summary: Get ATM branches by slug
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ATM branches
 */

atmRouter.get('/:slug/branches', atmCtrl.branchesByAtmSlug);

/**
 * @swagger
 * /bank:
 *   get:
 *     summary: Get all Atms
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ATMs
 */

atmRouter.get('/',atmCtrl.listAllAtm)
/**
 * @swagger
 * /bank/{id}:
 *   get:
 *     summary: Get ATM detail by id
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ATM detail
 */
atmRouter.get('/:id',atmCtrl.atmDetailById)

/**
 * @swagger
 * /atm/{id}:
 *   put:
 *     summary: Update atm by id
 *     tags: [ATMs] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ATM updated
 */

atmRouter.put('/:id',atmCtrl.atmUpdateById)

/**
 * @swagger
 * /atm/{id}:
 *   delete:
 *     summary: Delete ATM by id
 *     tags: [ATMs] 
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ATM deleted
 */

atmRouter.delete('/:id',atmCtrl.atmDeleteById)

/**
 * @swagger
 * /Atm:
 *   post:
 *     summary: Create a new Atm
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
*         description: ATM created
*/ 
atmRouter.post('/',atmCtrl.createAtm);


module.exports = atmRouter;
