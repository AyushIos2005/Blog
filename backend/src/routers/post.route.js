const express = require("express");
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const postRouter = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// api 
//post and patch only by user who create this posts
postRouter.post("/post",authMiddleware.authUser,upload.single("file"), postController.createPost);
postRouter.patch("/postupdate/:id",authMiddleware.authUser,upload.single("file"),postController.updatePost);
//all users get posts 
postRouter.get("/",authMiddleware.authUser,postController.getAllPost);
//only that user who create posts only that user can delete
postRouter.delete("/post/:id",authMiddleware.authUser,postController.deletePost);
//any user can likes and comments on posts
postRouter.post("/post/:id/like", authMiddleware.authUser, postController.LikePost);
postRouter.post("/post/:id/comment", authMiddleware.authUser, postController.CommentPost);
postRouter.get("/post/:id/comment", authMiddleware.authUser, postController.AllCommentGet);

module.exports = postRouter;