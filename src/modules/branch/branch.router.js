const express = require('express');
const branchRouter = express.Router();
const branchCtrl=require('./branch.controller')
const Branch = require('./branch.model');
const { verifyAdmin } = require('../../middlewares/auth.middleware');

// Public routes (no authentication required)
branchRouter.get('for-home',branchCtrl.branchForHome);
branchRouter.get('/',branchCtrl.listAllBranch);
branchRouter.get('/:id',branchCtrl.branchDetailById);
branchRouter.get('/atms/:id',branchCtrl.atmsByBranchId);
branchRouter.get('/count', async (req, res) => {
  try {
    const count = await Branch.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get branch count' });
  }
});

// Admin routes (require admin authentication)
branchRouter.post('/', verifyAdmin, branchCtrl.createBranch);
branchRouter.put('/:id', verifyAdmin, branchCtrl.branchUpdateById);
branchRouter.delete('/:id', verifyAdmin, branchCtrl.branchDeleteById);

module.exports = branchRouter;
