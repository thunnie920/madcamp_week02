const topTierVolumeConfig = {
  baseURL: "https://min-api.cryptocompare.com/data",
  defaultCurrency: "USD",
  limit: 10, // 상위 코인 개수
  apiKey: process.env.CRYPTO_API_KEY,
};

module.exports = topTierVolumeConfig;
