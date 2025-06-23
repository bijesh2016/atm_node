const router = require("express").Router();
const authRouter=require("../modules/auth/auth.router")

router.get("/", (req, res, next) => {
  res.json({
    data: "any data type",
    message: "Success",
    status: "OK",
    option: null,
  });
});


router.use('/auth',authRouter)
module.exports = router;
