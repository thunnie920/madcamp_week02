require("dotenv").config(); // 환경 변수 로드
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./src/passport/passport");
const connectDB = require("./src/config/dbConnect");

// 라우터 임포트
const aiChatRoutes = require("./src/routes/AIchat");
const topTierVolumeRoutes = require("./src/routes/topTierVolume");
const coinPriceRoutes = require("./src/routes/ohlcv");
const userRoutes = require("./src/routes/user");
const authRoutes = require("./src/routes/auth");

// MongoDB 연결
connectDB();

// Express 앱 초기화
const app = express();
const port = 4000;

// ======================
// 미들웨어 설정
// ======================
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 URL
    credentials: true, // 쿠키 포함 허용
  })
);
app.use(express.json()); // JSON 요청 본문 파싱
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// passport.js 초기화
app.use(passport.initialize());
app.use(passport.session());

// ======================
// 라우터 설정
// ======================
app.use("/chat", aiChatRoutes);
app.use("/volumelist", topTierVolumeRoutes);
app.use("/coinsprice", coinPriceRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

// ======================
// 에러 핸들링 미들웨어
// ======================
app.use((req, res, next) => {
  res.status(404).json({ message: "요청하신 경로를 찾을 수 없습니다." });
});

app.use((err, req, res, next) => {
  console.error("서버 에러:", err.stack);
  res.status(500).json({ message: "서버에 문제가 발생했습니다." });
});

// ======================
// 서버 시작
// ======================
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
