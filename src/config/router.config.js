const router = require("express").Router();
const authRouter = require("../modules/auth/auth.router");
const atmRouter = require("../modules/atm/atm.router");
const bankRouter = require("../modules/bank/bank.router");
const branchRouter = require("../modules/branch/branch.router");
const userRouter = require("../modules/user/user.router");
const provinceRouter = require("../modules/province/province.router");
const districtRouter = require("../modules/district/district.router");
const localLevelRouter = require("../modules/local_level/local_level.router");
const reviewRouter = require("../modules/review/review.router");
const contactRouter = require('../modules/contact/contact.router');
const adminContactRouter = require('../modules/contact/admin_contact.router');
const adminRouter = require('../modules/admin');
// const { authenticationRouter } = require("../modules/auth/authentication");

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
router.use('/user', userRouter);
router.use('/province', provinceRouter);
router.use('/district', districtRouter);
router.use('/local_level', localLevelRouter);
router.use('/reviews', reviewRouter);
router.use('/contacts', contactRouter);
router.use('/admin-contact', adminContactRouter);
router.use(adminRouter);
// router.use('/demo-auth', authenticationRouter);

module.exports = router;
