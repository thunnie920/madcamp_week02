const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 카카오 유저 ID
  userName: { type: String, required: true }, // 카카오 유저 이름
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
