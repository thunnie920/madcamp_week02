/*const express = require("express");
const { getCryptoHistory } = require("../controllers/cryptoController");

const router = express.Router();

// /api/crypto/history 경로 정의
router.get("/history", getCryptoHistory);

module.exports = router;*/

const express = require("express");
const { getTopCoins } = require("../controllers/cryptoController");

const router = express.Router();

// 거래량 기준 상위 코인 라우트
router.get("/top-coins", getTopCoins);

module.exports = router;
