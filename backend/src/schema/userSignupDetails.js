const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if password is new/modified
  try {
    const salt = await bcrypt.genSalt(2);
    this.password = await bcrypt.hash(this.password, salt); // replace plain password with hash
    next();
  } catch (err) {
    next(err);
  }
});

// method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
