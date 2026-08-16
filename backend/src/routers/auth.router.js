// login singup aur logout 

const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

//api 
router.post("/register",authController.UserRegister);
router.post("/login",authController.UserLogin);
router.get("/get-me",authMiddleware.authUser,authController.getMeController);
router.post("/logout",authController.UserLogout);
router.post("/verify-otp",authController.userotpVerfication);
router.post("/change-password",authMiddleware.authUser,authController.changePassword);
router.post("/forget-password",authController.forgetPassword);
router.post("/reset-password",authController.resetPassword);
module.exports = router;