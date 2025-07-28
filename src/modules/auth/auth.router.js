// // const authRouter=require("express").Router()
// // const checkLogin = require("../../middlewares/auth.middleware")
// // const bodyValidator = require("../../middlewares/validator.middleware")
// // const authCtrl=require("./auth.controller")
// // const {registerUserDTD,LoginDTD,ForgotPasswordDTD,ChangePasswordDTD}=require("./auth.validator")
// // const uploader=require("../../middlewares/file-upload.middleware")

// // /**
// //  * @swagger
// //  * /auth/register:
// //  *   post:
// //  *     summary: Register a new user
// //  *     tags: [Auth]
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             $ref: '#/components/schemas/RegisterUser'
// //  *     responses:
// //  *       200:
// //  *         description: Registration successful
// //  */
// // authRouter.post("/register",uploader("image").single,bodyValidator(registerUserDTD),authCtrl.registerUser)

// // /**
// //  * @swagger
// //  * /auth/activate/{token}:
// //  *   get:
// //  *     summary: Activate user profile
// //  *     tags: [Auth]
// //  *     parameters:
// //  *       - in: path
// //  *         name: token
// //  *         schema:
// //  *           type: string
// //  *         required: true
// //  *         description: Activation token
// //  *     responses:
// //  *       200:
// //  *         description: Account activated
// //  */
// // authRouter.get("/activate/:token",authCtrl.activateUserProfile)

// // /**
// //  * @swagger
// //  * /auth/login:
// //  *   post:
// //  *     summary: User login
// //  *     tags: [Auth]
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             $ref: '#/components/schemas/LoginUser'
// //  *     responses:
// //  *       200:
// //  *         description: Login successful
// //  */
// // authRouter.post("/login",bodyValidator(LoginDTD),authCtrl.login)

// // /**
// //  * @swagger
// //  * /auth/forgot-password:
// //  *   post:
// //  *     summary: Forgot Password
// //  *     tags: [Auth]
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             $ref: '#/components/schemas/ForgotPassword'
// //  *     responses:
// //  *       200:
// //  *         description: Password reset link sent
// //  */
// // authRouter.post("/forgot-password",bodyValidator(ForgotPasswordDTD),authCtrl.forgotPassword)

// // // Change Password
// // /**
// //  * @swagger
// //  * /auth/change-password:
// //  *   post:
// //  *     summary: Change Password
// //  *     tags: [Auth]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             $ref: '#/components/schemas/ChangePassword'
// //  *     responses:
// //  *       200:
// //  *         description: Password changed successfully
// //  */
// // authRouter.post("/change-password",checkLogin,bodyValidator(ChangePasswordDTD),authCtrl.changePassword)


// // /**
// //  * @swagger
// //  * /auth/me:
// //  *   post:
// //  *     summary: Get logged in user profile
// //  *     tags: [Auth]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     responses:
// //  *       200:
// //  *         description: User profile
// //  */
// // authRouter.post("/me",checkLogin,authCtrl.getLoggedInUserProfile)

// // /**
// //  * @swagger
// //  * /auth/logout:
// //  *   patch:  
// //  *     summary: Logout user
// //  *     tags: [Auth]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     responses:
// //  *       200:
// //     *         description: Logout successful
// //  */
// // authRouter.post("/logout",checkLogin,authCtrl.logout)

// // module.exports=authRouter


// const authRouter = require("express").Router();
// const { verifyToken, verifyUser, verifyAdmin } = require("../../middlewares/auth.middleware");
// const bodyValidator = require("../../middlewares/validator.middleware");
// const authCtrl = require("./auth.controller");
// const { registerUserDTD, LoginDTD, ForgotPasswordDTD, ChangePasswordDTD } = require("./auth.validator");
// const uploader = require("../../middlewares/file-upload.middleware");

// /**
//  * @swagger
//  * /auth/register:
//  *   post:
//  *     summary: Register a new user
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/RegisterUser'
//  *     responses:
//  *       200:
//  *         description: Registration successful
//  */
// authRouter.post("/register", bodyValidator(registerUserDTD), authCtrl.register);

// /**
//  * @swagger
//  * /auth/activate/{token}:
//  *   get:
//  *     summary: Activate user profile
//  *     tags: [Auth]
//  *     parameters:
//  *       - in: path
//  *         name: token
//  *         schema:
//  *           type: string
//  *         required: true
//  *         description: Activation token
//  *     responses:
//  *       200:
//  *         description: Account activated
//  */
// authRouter.get("/activate/:token", authCtrl.activateUserProfile);

// /**
//  * @swagger
//  * /auth/login:
//  *   post:
//  *     summary: User login
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/LoginUser'
//  *     responses:
//  *       200:
//  *         description: Login successful
//  */
// authRouter.post("/login", bodyValidator(LoginDTD), authCtrl.login);

// /**
//  * @swagger
//  * /auth/forgot-password:
//  *   post:
//  *     summary: Forgot Password
//  *     tags: [Auth]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/ForgotPassword'
//  *     responses:
//  *       200:
//  *         description: Password reset link sent
//  */
// authRouter.post("/forgot-password", bodyValidator(ForgotPasswordDTD), authCtrl.forgotPassword);

// /**
//  * @swagger
//  * /auth/change-password:
//  *   post:
//  *     summary: Change Password
//  *     tags: [Auth]
//  *     security:
//  *       - cookieAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/ChangePassword'
//  *     responses:
//  *       200:
//  *         description: Password changed successfully
//  */
// authRouter.post("/change-password", verifyToken, bodyValidator(ChangePasswordDTD), authCtrl.changePassword);

// /**
//  * @swagger
//  * /auth/me:
//  *   post:
//  *     summary: Get logged in user profile
//  *     tags: [Auth]
//  *     security:
//  *       - cookieAuth: []
//  *     responses:
//  *       200:
//  *         description: User profile
//  */
// authRouter.post("/me", authCtrl.getLoggedInUserProfile);

// /**
//  * @swagger
//  * /auth/logout:
//  *   post:
//  *     summary: Logout user
//  *     tags: [Auth]
//  *     security:
//  *       - cookieAuth: []
//  *     responses:
//  *       200:
//  *         description: Logout successful
//  */
// authRouter.post("/logout", verifyToken, authCtrl.logout);

// module.exports = authRouter;







const authRouter = require("express").Router();
const { verifyToken } = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/validator.middleware");
const authCtrl = require("./auth.controller");
const { registerUserDTD, LoginDTD, ForgotPasswordDTD, ChangePasswordDTD } = require("./auth.validator");
const uploader = require("../../middlewares/file-upload.middleware");

authRouter.post("/register", uploader("image").single("image"), bodyValidator(registerUserDTD), authCtrl.register);
authRouter.get("/activate/:token", authCtrl.activateUserProfile);
authRouter.post("/login", bodyValidator(LoginDTD), authCtrl.login);
authRouter.post("/forgot-password", bodyValidator(ForgotPasswordDTD), authCtrl.forgotPassword);
authRouter.post("/change-password", verifyToken, bodyValidator(ChangePasswordDTD), authCtrl.changePassword);
authRouter.post("/me", verifyToken, authCtrl.getLoggedInUserProfile);
authRouter.post("/logout", verifyToken, authCtrl.logout);

module.exports = authRouter;