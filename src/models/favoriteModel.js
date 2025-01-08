const mongoose = require("mongoose");

// 좋아요한 코인 스키마 정의
const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // User 컬렉션과 참조 관계
    ref: "User",
    required: true,
  },
  symbol: {
    type: String, // 코인의 심볼 (예: BTC)
    required: true,
  },
  fullName: {
    type: String, // 코인의 전체 이름 (예: Bitcoin)
    required: true,
  },
  price: {
    type: Number, // 현재 가격
    required: false, // 필요에 따라 필수 여부 설정 가능
  },
  changePct24Hour: {
    type: Number, // 24시간 변화율 (퍼센트)
    required: false,
  },
  volume24Hour: {
    type: Number, // 24시간 거래량
    required: false,
  },
  addedAt: {
    type: Date, // 좋아요한 날짜
    default: Date.now,
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
