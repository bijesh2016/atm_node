const express = require('express');
const atmRouter = express.Router();
const atmCtrl = require("./atm.controller");

atmRouter.get('/for-home', atmCtrl.atmsForHome);
// atmRouter.get('/:slug/branches', atmCtrl.branchesByAtmSlug);

atmRouter.get('/',atmCtrl.listAllAtm)
atmRouter.get('/:id',atmCtrl.atmDetailById)
atmRouter.get('/:id',atmCtrl.atmUpdateById)
atmRouter.get('/:id',atmCtrl.atmDeleteById)

module.exports = atmRouter;
