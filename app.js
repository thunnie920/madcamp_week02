require("dotenv").config();
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
const aiChatRoutes = require("./src/routes/AIchat");
const cryptoRoutes = require("./src/routes/crypto");

require("dotenv").config(); // 환경 변수 로드

const app = express();
// 모든 출처 허용 (개발 환경에서만 사용)
app.use(cors());
const port = 4000;

// 미들웨어 설정
app.use(bodyParser.json()); // JSON 요청 본문 파싱
app.use("/chat", aiChatRoutes); // /chat 경로로 라우트 연결
app.use("/api/crypto", cryptoRoutes); // 라우터 연결

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
