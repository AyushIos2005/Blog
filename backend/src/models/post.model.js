const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    file: {
      type: [String],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },
    comment : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    like : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Like",
    }],
  },
  {
    timestamps: true,
  }
);

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;