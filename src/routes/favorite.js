const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

// 좋아요 토글 라우트
router.post("/toggle", favoriteController.toggleFavorite);

// 회원의 좋아요 상태 가져오기
router.get("/", favoriteController.getFavorites);

module.exports = router;
