require("dotenv").config(); // 환경 변수 로드
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

// 사용자 모델 임포트 (DB에 사용자 정보 저장)
const User = require("../models/userModel"); // DB 모델 예시

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_API_KEY, // REST API 키
      callbackURL: "http://localhost:4000/auth/kakao/callback", // 리다이렉트 URI
      // 아래처럼 strategy 설정 시에 customParams로 prompt를 지정
      customParams: {
        prompt: "login",
      },
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 카카오 프로필 정보에서 필요한 데이터 추출
        const { id, username } = profile; // 이메일 없이 id와 username만 사용
        const profileImage = profile._json.properties.profile_image;

        // 기존 사용자 확인 또는 새 사용자 생성
        let user = await User.findOne({ kakaoId: id });
        if (!user) {
          user = await User.create({
            kakaoId: id,
            username: username || `kakao_${id}`,
            profileImage: profileImage || null,
          });
        }

        return done(null, user); // 성공
      } catch (err) {
        return done(err, null); // 에러 발생
      }
    }
  )
);

// 세션에 사용자 정보 저장
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 세션에서 사용자 정보 복원
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
