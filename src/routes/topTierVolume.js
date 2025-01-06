const express = require("express");
const { getTopCoins } = require("../controllers/topTierVolumeController");

const router = express.Router();

// 거래량 기준 상위 코인 라우트
router.get("/top-coins", getTopCoins);

module.exports = router;
