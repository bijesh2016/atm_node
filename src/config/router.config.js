const router = require("express").Router();
const authRouter = require("../modules/auth/auth.router");
const atmRouter = require("../modules/atm/atm.router");
const bankRouter = require("../modules/bank/bank.router");
const branchRouter = require("../modules/branch/branch.router");

router.get("/", (req, res, next) => {
  res.json({
    data: "any data type",
    message: "Success",
    status: "OK",
    option: null,
  });
});

router.use('/auth', authRouter);
router.use('/atm', atmRouter);
router.use('/bank', bankRouter);
router.use('/branch', branchRouter);

module.exports = router;
