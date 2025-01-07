const express = require("express");
const {
  createSampleUsers,
  getAllUsers,
  createUser,
} = require("../controllers/userController");

const router = express.Router();

// 라우트 정의
router.post("/create-sample", createSampleUsers); // 샘플 데이터 생성
router.get("/", getAllUsers); // 모든 회원 조회
router.post("/create", createUser);

module.exports = router;
