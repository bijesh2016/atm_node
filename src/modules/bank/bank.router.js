const express = require('express');
const bankRouter = express.Router();
const bankCtrl=require("./bank.controller");

bankRouter.get("/for-home",bankCtrl.banksForHome);

bankRouter.get('/',bankCtrl.listAllBank);
bankRouter.get('/:id',bankCtrl.bankDetailById);
bankRouter.put('/:id',bankCtrl.bankUpdateById);
bankRouter.delete('/:id',bankCtrl.bankDeleteById);

module.exports =bankRouter;
