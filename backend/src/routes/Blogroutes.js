const express = require("express");
const Blog = require("../schema/Blog");
const Blogroute = express.Router();
const jwt = require("jsonwebtoken");

const tokenverify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ mes: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    req.user = decoded;

    next();
  } catch (e) {
    console.log(e);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};
Blogroute.get("/allblogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "email username");
    if (!blogs) {
      return res.status(401).json({ meg: "No Blogs" });
    }

    return res.status(200).json({ blogs: blogs });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ meg: "server error" });
  }
});

Blogroute.get("/myblog", tokenverify, async (req, res) => {
  try {
    const myblogs = await Blog.find({ author: req.user.id });

    return res.status(200).json({ blogs: myblogs });
  } catch (error) {
    return res.status(500).json({ meg: "server error" });
  }
});

Blogroute.get("/blog/:id", tokenverify, async (req, res) => {
  const { id } = req.params;
  try {
    const oneblog = await Blog.findOne({ _id: id, author: req.user.id });
    if (!oneblog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.status(200).json({ blog: oneblog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

Blogroute.post("/createblog", tokenverify, async (req, res) => {
  console.log(req.body);
  try {
    const { title, content } = req.body;
    const newblog = await Blog.create({
      title,
      content,
      author: req.user.id,
    });
    res.status(201).json(newblog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

Blogroute.delete("/deleteblog/:id", tokenverify, async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findOne({ _id: id, author: req.user.id });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found or not authorized" });
    }

    await Blog.deleteOne({ _id: id });

    res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

Blogroute.put("/updateblog/:id", tokenverify, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const blog = await Blog.findOne({ _id: id, author: req.user.id });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found or not authorized" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();

    res.status(200).json({ msg: "Blog updated successfully", blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = Blogroute;
