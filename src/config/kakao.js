module.exports = {
  clientID: process.env.KAKAO_API_KEY,
  callbackURL: "http://localhost:4000/auth/kakao/callback", // Redirect URI
};
