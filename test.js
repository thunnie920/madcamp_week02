require("dotenv").config(); // 환경 변수 로드
const mongoose = require("mongoose");
const User = require("./src/models/userModel"); // User 모델 경로를 정확히 지정하세요

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB 연결 성공!");

    const testUser = new User({
      user_id: "test_user2",
      password: "test_password",
      email: "test@exampleee.com",
    });

    const result = await testUser.save();
    console.log("사용자 저장 성공:", result);

    mongoose.disconnect(); // 연결 종료
  })
  .catch((err) => {
    console.error("오류 발생:", err);
    mongoose.disconnect(); // 연결 종료
  });
