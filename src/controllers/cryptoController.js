/*const axios = require("axios");
const cryptoConfig = require("../config/crypto");

// 상위 70개 코인 가져오기
exports.getTopCoins = async (req, res) => {
  try {
    // CryptoCompare API 호출
    const response = await axios.get(
      `${cryptoConfig.baseURL}/top/totaltoptiervolfull`,
      {
        params: {
          limit: cryptoConfig.limit,
          tsym: cryptoConfig.defaultCurrency,
        },
      }
    );

    const topCoinsData = response.data.Data;

    // 필요한 데이터만 추출
    const formattedData = topCoinsData.map((coin) => ({
      symbol: coin.CoinInfo.Name, // 코인 심볼
      fullName: coin.CoinInfo.FullName, // 코인 풀네임
      price: coin.RAW[cryptoConfig.defaultCurrency].PRICE, // 현재 가격
      changePct24Hour: coin.RAW[cryptoConfig.defaultCurrency].CHANGEPCT24HOUR, // 24시간 변동률
      volume24Hour: coin.RAW[cryptoConfig.defaultCurrency].TOTALVOLUME24HTO, // 24시간 거래량
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error fetching top coins:", error.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch top coins data" });
  }
}; */

const axios = require("axios");
const cryptoConfig = require("../config/crypto");
const cron = require("node-cron");

let cachedTopCoins = [];

// 데이터 가져오는 함수
const fetchTopCoins = async () => {
  try {
    const response = await axios.get(
      `${cryptoConfig.baseURL}/top/totaltoptiervolfull`,
      {
        params: {
          limit: cryptoConfig.limit,
          tsym: cryptoConfig.defaultCurrency,
        },
      }
    );

    const topCoinsData = response.data.Data;

    cachedTopCoins = topCoinsData.map((coin) => ({
      symbol: coin.CoinInfo.Name,
      fullName: coin.CoinInfo.FullName,
      price: coin.RAW[cryptoConfig.defaultCurrency].PRICE,
      changePct24Hour: coin.RAW[cryptoConfig.defaultCurrency].CHANGEPCT24HOUR,
      volume24Hour: coin.RAW[cryptoConfig.defaultCurrency].TOTALVOLUME24HTO,
    }));

    console.log("Updated top coins data");
  } catch (error) {
    console.error("Error fetching top coins:", error.message);
  }
};

// 매 30초마다 실행하는 크론 작업
cron.schedule("*/30 * * * * *", () => {
  fetchTopCoins();
});

// 라우트에서 캐시된 데이터를 반환
exports.getTopCoins = (req, res) => {
  res.json({ success: true, data: cachedTopCoins });
};
