const express = require("express");
const {
  cachedDailyCoins,
  cachedHourlyCoins,
  cachedMinuteCoins,
} = require("../controllers/ohlcvController");

const router = express.Router();

router.get("/ohlcv/day", (req, res) => {
  res.json({ success: true, data: cachedDailyCoins });
});

router.get("/ohlcv/hour", (req, res) => {
  res.json({ success: true, data: cachedHourlyCoins });
});

router.get("/ohlcv/minute", (req, res) => {
  res.json({ success: true, data: cachedMinuteCoins });
});

module.exports = router;
