const authRouter=require("express").Router()
const checkLogin = require("../../middlewares/auth.middleware")
const bodyValidator = require("../../middlewares/validator.middleware")
const authCtrl=require("./auth.controller")
const {registerUserDTD,LoginDTD}=require("./auth.validator")
// const uploader=require("../../middlewares/file-upload.middleware")

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       200:
 *         description: Registration successful
 */
authRouter.post("/register",bodyValidator(registerUserDTD),authCtrl.registerUser)

/**
 * @swagger
 * /auth/activate/{token}:
 *   get:
 *     summary: Activate user profile
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Activation token
 *     responses:
 *       200:
 *         description: Account activated
 */
authRouter.get("/activate/:token",authCtrl.activateUserProfile)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post("/login",bodyValidator(LoginDTD),authCtrl.login)

/**
 * @swagger
 * /auth/me:
 *   post:
 *     summary: Get logged in user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
authRouter.post("/me",checkLogin,authCtrl.getLoggedInUserProfile)

/**
 * @swagger
 * /auth/logout:
 *   patch:  
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
    *         description: Logout successful
 */
authRouter.patch("/logout",checkLogin,authCtrl.logout)

module.exports=authRouter
