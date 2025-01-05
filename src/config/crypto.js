/*const cryptoConfig = {
  baseURL: "https://min-api.cryptocompare.com/data/v2",
  defaultCurrency: "USD", // 기본 통화
};

module.exports = cryptoConfig;*/

const cryptoConfig = {
  baseURL: "https://min-api.cryptocompare.com/data",
  defaultCurrency: "USD",
  limit: 70, // 상위 코인 개수
};

module.exports = cryptoConfig;
