const axios = require("axios");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const kakaoLogin = async (req, res) => {
  const { code } = req.body; // 프론트엔드에서 전달된 인증 코드
  if (!code) {
    return res.status(400).send("인증 코드가 필요합니다.");
  }

  try {
    // 1. 카카오 API를 통해 액세스 토큰 가져오기
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: "http://localhost:4000/auth/kakao/callback",
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. 액세스 토큰으로 사용자 정보 가져오기
    const userResponse = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const kakaoUser = userResponse.data;

    // 3. DB에 사용자 정보 추가 또는 업데이트
    const existingUser = await User.findOne({ user_id: kakaoUser.id });

    if (existingUser) {
      // 기존 사용자: 마지막 로그인 시간 업데이트
      existingUser.last_login = new Date();
      await existingUser.save();
      return res
        .status(200)
        .json({ message: "로그인 성공", user: existingUser });
    } else {
      // 신규 사용자: DB에 추가
      const newUser = new User({
        user_id: kakaoUser.id,
        password: await bcrypt.hash("defaultPassword123!", 10), // 기본 비밀번호 설정
        email: kakaoUser.kakao_account.email || "no-email@example.com", // 이메일 없는 경우 처리
      });

      await newUser.save();
      return res
        .status(201)
        .json({ message: "회원 가입 및 로그인 성공", user: newUser });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("카카오 로그인 중 오류가 발생했습니다.");
  }
};

module.exports = { kakaoLogin };
