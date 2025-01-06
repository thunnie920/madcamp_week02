const topTierVolumeConfig = {
  baseURL: "https://min-api.cryptocompare.com/data",
  defaultCurrency: "USD",
  limit: 20, // 상위 코인 개수
  apiKey: process.env.CRYPTO_API_KEY,
};

module.exports = topTierVolumeConfig;
