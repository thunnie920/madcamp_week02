require("dotenv").config(); // 환경 변수 로드
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const aiChatRoutes = require("./src/routes/AIchat");
const topTierVolumeRoutes = require("./src/routes/topTierVolume");
const coinPriceRoutes = require("./src/routes/ohlcv");
const app = express();
const port = 4000;

// 미들웨어 설정
app.use(cors()); // 모든 출처 허용 (개발 환경에서만 사용)
app.use(express.json()); // JSON 요청 본문 파싱

// AI Chat 라우트는 항상 실행
app.use("/chat", aiChatRoutes); // /chat 경로로 라우트 연결
// 기타 라우트 연결
app.use("/volumelist", topTierVolumeRoutes); // volumelist 경로로 라우트 연결
app.use("/coinsprice", coinPriceRoutes); // coins 경로로 라우트 연결

// 서버 시작
app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
});
