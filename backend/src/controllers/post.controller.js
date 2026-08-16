const jwt = require("jsonwebtoken");
const uploadFile = require("../services/storage.service");
const postModel = require("../models/post.model");
const { commentModel, likeModel } = require("../models/comment.model");

async function createPost(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const { title, description, tags } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        message: "Title and description are required",
      });
    }

    const result = await uploadFile(req.file.buffer, req.file.originalname);

    const post = await postModel.create({
      file: [result.url],
      title,
      description,
      author: decode.id,
      tags: tags || [],
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.log("Error in createPost:", err);

    return res.status(500).json({
      message: "Post creation failed",
    });
  }
}

async function getAllPost(req, res) {
  try {
    const posts = await postModel.find().populate("author");

    return res.status(200).json({
      message: "posts fetched Successfully",
      posts: posts,
    });
  } catch (err) {
    console.log("Error in getAllPost:", err);

    return res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
}

async function updatePost(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const { id } = req.params;
    const { title, description, tags } = req.body;

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // only the author who created the post can update it
    if (post.author.toString() !== decode.id) {
      return res.status(403).json({
        message: "You are not authorized to update this post",
      });
    }

    if (title) post.title = title;
    if (description) post.description = description;
    if (tags) post.tags = Array.isArray(tags) ? tags : [tags];

    // optional: allow replacing the file if a new one is uploaded
    if (req.file) {
      const result = await uploadFile(req.file.buffer, req.file.originalname);
      post.file = [result.url];
    }

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.log("Error in updatePost:", err);

    return res.status(500).json({
      message: "Post update failed",
    });
  }
}

async function deletePost(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // only the author who created the post can delete it
    if (post.author.toString() !== decode.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
      });
    }

    await postModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log("Error in deletePost:", err);

    return res.status(500).json({
      message: "Post deletion failed",
    });
  }
}

async function LikePost(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const { id } = req.params; // post id

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const existingLike = await likeModel.findOne({
      post: id,
      user: decode.id,
    });

    // toggle: if already liked, unlike it
    if (existingLike) {
      await likeModel.findByIdAndDelete(existingLike._id);
      await postModel.findByIdAndUpdate(id, {
        $pull: { like: existingLike._id },
      });

      return res.status(200).json({
        message: "Post unliked successfully",
        liked: false,
      });
    }

    const newLike = await likeModel.create({
      post: id,
      user: decode.id,
    });

    await postModel.findByIdAndUpdate(id, {
      $push: { like: newLike._id },
    });

    return res.status(200).json({
      message: "Post liked successfully",
      liked: true,
      like: newLike,
    });
  } catch (err) {
    console.log("Error in LikePost:", err);

    return res.status(500).json({
      message: "Failed to like post",
    });
  }
}

async function CommentPost(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const { id } = req.params; // post id
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment text is required",
      });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const newComment = await commentModel.create({
      post: id,
      user: decode.id,
      comment: comment.trim(),
    });

    await postModel.findByIdAndUpdate(id, {
      $push: { comment: newComment._id },
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (err) {
    console.log("Error in CommentPost:", err);

    return res.status(500).json({
      message: "Failed to add comment",
    });
  }
}

async function AllCommentGet(req, res) {
  try {
    const { id } = req.params; // post id

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comments = await commentModel
      .find({ post: id })
      .populate("user")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
    });
  } catch (err) {
    console.log("Error in AllCommentGet:", err);

    return res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
}

module.exports = {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  LikePost,
  CommentPost,
  AllCommentGet,
};