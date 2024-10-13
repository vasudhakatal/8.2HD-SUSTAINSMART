// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String, // You might want to use a user ID reference instead
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
