require("dotenv").config(); // 환경 변수 로드
const mongoose = require("mongoose");
const Favorite = require("./src/models/Favorite"); // Favorite 모델 경로를 정확히 지정하세요
const User = require("./src/models/User"); // User 모델 경로를 정확히 지정하세요

// 테스트 실행 함수
const runTest = async () => {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.DB_CONNECT_USER, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB 연결 성공!");

    // 테스트 사용자 생성 또는 조회
    const user = await User.findOne({ user_id: "test_user" });
    if (!user) {
      console.log("테스트 사용자 생성");
      const newUser = new User({
        user_id: "test_user",
        password: "test_password",
        email: "test@example.com",
      });
      await newUser.save();
      console.log("새 사용자 생성 완료:", newUser);
    }

    // 좋아요 추가 테스트
    console.log("좋아요 추가 테스트");
    const newFavorite = new Favorite({
      user: user?._id || (await User.findOne({ user_id: "test_user" }))._id,
      symbol: "BTC",
      fullName: "Bitcoin",
      price: 97012.4196028232,
      changePct24Hour: -4.626241308356076,
      volume24Hour: 34887785513.620544,
    });

    await newFavorite.save();
    console.log("좋아요 저장 완료:", newFavorite);

    // 좋아요 조회 테스트
    console.log("사용자 좋아요 목록 확인");
    const favorites = await Favorite.find({ user: user?._id }).populate("user");
    console.log("사용자가 좋아요한 코인들:", favorites);

    // 좋아요 삭제 테스트
    console.log("좋아요 삭제 테스트");
    await Favorite.deleteOne({ _id: newFavorite._id });
    console.log("좋아요 삭제 완료");

    // 삭제 후 확인
    const remainingFavorites = await Favorite.find({ user: user?._id });
    console.log("남아 있는 좋아요:", remainingFavorites);
  } catch (err) {
    console.error("오류 발생:", err);
  } finally {
    // MongoDB 연결 종료
    await mongoose.disconnect();
    console.log("MongoDB 연결 종료");
  }
};

// 테스트 실행
runTest();
