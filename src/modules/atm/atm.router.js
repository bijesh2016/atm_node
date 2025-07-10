const express = require('express');
const atmRouter = express.Router();
const atmCtrl = require("./atm.controller");
const uploader=require("../../middlewares/file-upload.middleware")
const {bodyValidator}= require('../../middlewares/validator.middleware');
const {AddATMDTD}=require("../atm/atm.validator")
/**
 * @swagger
 * /atm/for-home:
 *   get:
 *     summary: Get ATMs for home
 *     tags: [ATMs]
  *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ATM ID

 *     responses:
 *       200:
 *         description: List of ATMs for home
 */
atmRouter.get('/for-home',atmCtrl.atmsForHome);
/**
 * @swagger
 * /ATM/branches/{slug}:
 *   get:
 *     summary: Get ATM branches by slug
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
  *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ATM ID

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
   *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ATM ID

 *     responses:
 *       200:
 *         description: List of ATMs
 */

atmRouter.get('/',uploader('image').single('image'),atmCtrl.listAllAtm);

/**
 * @swagger
 * /bank/{id}:
 *   get:
 *     summary: Get ATM detail by id
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ATM ID
 *     responses:
 *       200:
 *         description: ATM detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ATM'
 */
atmRouter.get('/:id', atmCtrl.atmDetailById);

/**
 * @swagger
 * /atm/{id}:
 *   put:
 *     summary: Update ATM by id
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ATM ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ATM'
 *     responses:
 *       200:
 *         description: ATM updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ATM'
 */
atmRouter.put('/:id', atmCtrl.atmUpdateById);

/**
 * @swagger
 * /atm/{id}:
 *   delete:
 *     summary: Delete ATM by id
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ATM ID
 *     responses:
 *       200:
 *         description: ATM deleted
 */
atmRouter.delete('/:id', atmCtrl.atmDeleteById);

/**
 * @swagger
 * /atm:
 *   post:
 *     summary: Create a new ATM
 *     tags: [ATMs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ATM'
 *     responses:
 *       200:
 *         description: ATM created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ATM'
 */
atmRouter.post('/',atmCtrl.createAtm);

module.exports = atmRouter;
