const express = require("express");
const { getDailyCoins } = require("../controllers/dailyController");

const router = express.Router();

// 거래량 기준 상위 코인 라우트
router.get("/daily-coins", getDailyCoins);

module.exports = router;
