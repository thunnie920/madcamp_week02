const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 회원 스키마 정의
const userSchema = new mongoose.Schema({
  kakaoId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  profileImage: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
