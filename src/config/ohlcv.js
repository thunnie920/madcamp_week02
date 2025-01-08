const OHLCVConfig = {
  baseURL: "https://min-api.cryptocompare.com/data",
  tsym: "USD",
  limit: 10,
  apiKey: process.env.CRYPTO_API_KEY, // 환경 변수에서 API 키 불러오기
};

module.exports = OHLCVConfig;
