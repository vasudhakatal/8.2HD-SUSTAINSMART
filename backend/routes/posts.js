// routes/posts.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET all community posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by latest posts first
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new community post
router.post("/add", async (req, res) => {
  const { content, author } = req.body; // Expect author in the request body

  if (!content || !author) {
    return res.status(400).json({ message: "Content and author are required" });
  }

  try {
    const newPost = new Post({
      content,
      author, // Use the author from the request body
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error adding post:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a community post (optional)
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json({ message: "Post removed" });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
