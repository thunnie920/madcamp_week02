const express = require("express");
const passport = require("passport");

const router = express.Router();

// 카카오 로그인 라우트
router.get(
  "/kakao",
  passport.authenticate("kakao", {
    // Kakao 로그인 시도 시, 항상 로그인 화면을 띄우도록 강제
    customParams: {
      prompt: "login",
    },
    scope: ["profile_nickname", "profile_image"],
  })
);

// 카카오 인증 후 콜백 처리
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    // 로그인 세션 확인
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "인증 실패" });
    }
    console.log("Logged-in user:", req.user);

    // 프론트엔드로 리다이렉트
    const frontendURL = `http://localhost:3000/main`;
    res.redirect(frontendURL);
  }
);

// 로그아웃 라우트 (예: /auth/logout)
router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "로그아웃 실패" });
      }
      req.session.destroy((err) => {
        if (err) console.error("세션 삭제 실패:", err);
        res.clearCookie("connect.sid");
        // 여기서는 redirect X, JSON 응답
        return res.json({ message: "로그아웃 완료" });
      });
    });
  } else {
    req.session.destroy((err) => {
      if (err) console.error("세션 삭제 실패:", err);
      res.clearCookie("connect.sid");
      // 마찬가지로 JSON 응답
      return res.json({ message: "로그인 상태 아님" });
    });
  }
});

// 로그인 실패 라우트
router.get("/login", (req, res) => {
  res.status(401).json({
    message: "로그인이 실패했습니다. 다시 시도해주세요.",
  });
});

// 인증 여부 확인용 미들웨어 예시
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    message: "로그인이 필요합니다.",
  });
};

// 예시: 로그인 성공 시 개인 정보 확인 라우트
router.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    message: "로그인에 성공했습니다!",
    user: req.user, // 인증된 사용자 정보
  });
});

module.exports = router;
