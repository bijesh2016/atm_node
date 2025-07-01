const express = require('express');
const branchRouter = express.Router();
const branchCtrl=require('./branch.controller')

branchRouter.get('for-home',branchCtrl.branchForHome);
branchRouter.get('/',branchCtrl.listAllBranch);

branchRouter.get('/:id',branchCtrl.branchDetailById);
branchRouter.put('/:id',branchCtrl.branchUpdateById);
branchRouter.delete('/:id',branchCtrl.branchDeleteById);


module.exports = branchRouter;
