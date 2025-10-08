const express = require("express");
const User = require("../schema/userSignupDetails");
const userSignlogrouter = express.Router();
const jwt = require("jsonwebtoken");

userSignlogrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const macth = await user.comparePassword(password);
    if (!macth) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, user: user.username, email: user.email },
      process.env.JWT_TOKEN,
      { expiresIn: "1d" }
    );

    res.status(201).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

userSignlogrouter.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      console.log("username,password,email any one missing");
      return res.status(500);
    }

    const newuser = await User.create({ username, email, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = userSignlogrouter;
