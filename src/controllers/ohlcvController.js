const axios = require("axios");
const cron = require("node-cron");
const {
  fetchTopCoins,
  getCachedTopCoins,
} = require("./topTierVolumeController");
const OHLCVConfig = require("../config/ohlcv");

let cachedDailyCoins = {};
let cachedHourlyCoins = {};
let cachedMinuteCoins = {};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchOHLCV = async (type) => {
  const endpoints = {
    day: "histoday",
    hour: "histohour",
    minute: "histominute",
  };

  const limits = {
    day: OHLCVConfig.limit || 30,
    hour: OHLCVConfig.limit || 24,
    minute: OHLCVConfig.limit || 60,
  };

  if (!endpoints[type]) {
    console.error(`잘못된 요청 유형: ${type}`);
    return;
  }

  try {
    const currentTopCoins = getCachedTopCoins();
    if (currentTopCoins.length === 0) {
      console.log("상위 코인이 비어 있습니다. 데이터를 가져옵니다...");
      await fetchTopCoins();
    }

    const updatedTopCoins = getCachedTopCoins();
    if (updatedTopCoins.length === 0) {
      console.error("fetchTopCoins 후에도 cachedTopCoins가 비어 있습니다.");
      return;
    }

    console.log(`Fetching ${type} OHLCV data for coins...`);

    for (const coin of updatedTopCoins) {
      console.log(`${coin.symbol}에 대한 ${type} 데이터를 가져옵니다.`);
      try {
        const response = await axios.get(
          `${OHLCVConfig.baseURL}/v2/${endpoints[type]}`,
          {
            params: {
              fsym: coin.symbol,
              tsym: OHLCVConfig.tsym,
              limit: limits[type],
            },
            headers: {
              authorization: `Apikey ${OHLCVConfig.apiKey}`,
            },
          }
        );

        console.log(`API 응답(${coin.symbol}, ${type}):`, response.data);

        const ohlcvData = response.data.Data?.Data || [];
        if (ohlcvData.length === 0) {
          console.warn(`${coin.symbol}에 대한 ${type} 데이터가 없습니다.`);
        }

        const mappedData = ohlcvData.map((entry) => ({
          date: new Date(entry.time * 1000).toLocaleDateString(),
          close: entry.close,
        }));

        if (type === "day") {
          cachedDailyCoins[coin.symbol] = {
            symbol: coin.symbol,
            fullName: coin.fullName,
            daily: mappedData,
          };
        } else if (type === "hour") {
          cachedHourlyCoins[coin.symbol] = {
            symbol: coin.symbol,
            fullName: coin.fullName,
            hourly: mappedData,
          };
        } else if (type === "minute") {
          cachedMinuteCoins[coin.symbol] = {
            symbol: coin.symbol,
            fullName: coin.fullName,
            minute: mappedData,
          };
        }
      } catch (error) {
        console.error(
          `${coin.symbol} 데이터를 가져오는 중 오류 발생:`,
          error.message
        );
      }

      await delay(100);
    }

    console.log(`모든 ${type} 데이터 업데이트 완료.`);
  } catch (error) {
    console.error(`${type} 데이터를 가져오는 중 오류 발생:`, error.message);
  }
};

const getOHLCVData = (req, res) => {
  const { type } = req.query;
  if (type === "day") {
    res.json({ success: true, data: cachedDailyCoins });
  } else if (type === "hour") {
    res.json({ success: true, data: cachedHourlyCoins });
  } else if (type === "minute") {
    res.json({ success: true, data: cachedMinuteCoins });
  } else {
    res.status(400).json({ success: false, message: "Invalid type parameter" });
  }
};

// 서버 시작 시 초기 데이터 로드
fetchOHLCV("day");
fetchOHLCV("hour");
fetchOHLCV("minute");

// Cron 스케줄링
cron.schedule("0 0 * * *", () => fetchOHLCV("day"));
cron.schedule("0 * * * *", () => fetchOHLCV("hour"));
cron.schedule("*/5 * * * *", () => fetchOHLCV("minute"));

module.exports = {
  fetchOHLCV,
  getOHLCVData,
  cachedDailyCoins,
  cachedHourlyCoins,
  cachedMinuteCoins,
};
