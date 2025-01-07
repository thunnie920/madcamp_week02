require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./src/passport/passport");
const connectDB = require("./src/config/dbConnect");
const http = require("http");
const { Server } = require("socket.io");

// (1) MongoDB 연결
connectDB();

// (2) User 모델 임포트
const User = require("./src/models/userModel");

// 라우터 임포트
const aiChatRoutes = require("./src/routes/AIchat");
const topTierVolumeRoutes = require("./src/routes/topTierVolume");
const coinPriceRoutes = require("./src/routes/ohlcv");
const authRoutes = require("./src/routes/auth");

// Express 앱 초기화
const app = express();
const port = 4000;

// HTTP 서버 생성
const httpServer = http.createServer(app);

// (3) Socket.IO 서버 초기화
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// (4) WebSocket 이벤트 처리
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // (4-1) 클라이언트 -> 서버: kakao-info 이벤트로 kakaoId 전달
  socket.on("kakao-info", async (kakaoId) => {
    try {
      const userDoc = await User.findOne({ kakaoId }).lean();
      if (!userDoc) {
        console.log("User not found in DB with kakaoId:", kakaoId);
        socket.emit("init", null); // 유저 정보 없음
      } else {
        console.log("User found:", userDoc);
        // (4-2) 서버 -> 클라이언트: init 이벤트로 유저 정보 전달
        socket.emit("init", {
          _id: userDoc._id.toString(),
          kakaoId: userDoc.kakaoId,
          username: userDoc.username, // 프론트와 맞춤
          profileImage: userDoc.profileImage, // 있을 경우
        });
      }
    } catch (err) {
      console.error("Error while finding user by kakaoId:", err);
    }
  });

  // (4-3) 클라이언트 -> 서버: send message 이벤트로 메시지 수신
  socket.on("send message", (message) => {
    console.log("Message received:", message);
    // (4-4) 서버 -> 모든 클라이언트: receive message 브로드캐스트
    io.emit("receive message", message);
  });

  // 연결 해제
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ======================
// 미들웨어 설정
// ======================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
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
app.use("/auth", authRoutes);

// ======================
// 에러 핸들링
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
httpServer.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
