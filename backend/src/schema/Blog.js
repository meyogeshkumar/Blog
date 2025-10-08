const { request } = require("express");
const mongoose = require("mongoose");

const Blogsheme = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
    require: true,
  },
});

const Blog = mongoose.model("Blog", Blogsheme);

module.exports = Blog;
