const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const profileController = require("../controllers/profile.controller")
const upload = require("../middlewares/multer.middleware");
const profileRouter = express.Router();

profileRouter.post("/createProfile",authMiddleware.authUser,upload.single("profileImage"),profileController.createProfile);
profileRouter.patch("/updateProfile/:id",authMiddleware.authUser,upload.single("profileImage"),profileController.updateProfile);
profileRouter.delete("/deleteProfile/:id",authMiddleware.authUser,profileController.deleteProfile);
profileRouter.get("/profile-detail",authMiddleware.authUser,profileController.getProfile)

module.exports = profileRouter;