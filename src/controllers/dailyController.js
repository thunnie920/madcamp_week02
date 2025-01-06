const axios = require("axios");
const cron = require("node-cron");
const dailyOHLCVConfig = require("../config/daily");

// -- "getter 함수"를 통해 cachedTopCoins를 조회
//    필요 시 fetchTopCoins를 직접 불러올 수도 있음
const {
  fetchTopCoins, // or 필요 없다면 가져오지 않아도 됨
  getCachedTopCoins,
} = require("./topTierVolumeController");

let cachedDailyCoins = {};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// -- DailyCoins Fetch
const fetchDailyCoins = async () => {
  try {
    // 1. 현재 상위 코인 데이터가 비어 있으면 fetchTopCoins 호출
    const currentTopCoins = getCachedTopCoins();
    if (currentTopCoins.length === 0) {
      console.log("상위 코인이 비어 있습니다. 데이터를 가져옵니다...");
      await fetchTopCoins(); // 비동기 호출
    }

    // 2. fetchTopCoins 완료 후 다시 가져오기
    const updatedTopCoins = getCachedTopCoins();
    if (updatedTopCoins.length === 0) {
      console.error("fetchTopCoins 후에도 cachedTopCoins가 비어 있습니다.");
      return;
    }

    console.log("현재 cachedTopCoins 상태:", updatedTopCoins);

    // 3. 각 코인별로 일별 OHLCV 데이터를 순차적으로 호출 (딜레이 포함)
    for (const coin of updatedTopCoins) {
      console.log(`${coin.symbol}에 대한 일별 데이터를 가져옵니다.`);
      try {
        const response = await axios.get(
          `${dailyOHLCVConfig.baseURL}/v2/histoday`,
          {
            params: {
              fsym: coin.symbol,
              tsym: dailyOHLCVConfig.tsym,
              limit: dailyOHLCVConfig.limit,
            },
            headers: {
              authorization: `Apikey ${dailyOHLCVConfig.apiKey}`, // 헤더에 API 키 추가
            },
          }
        );

        console.log(`API 응답(${coin.symbol}):`, response.data);

        const dailyData = response.data.Data?.Data || [];
        if (dailyData.length === 0) {
          console.warn(`${coin.symbol}에 대한 데이터가 없습니다.`);
        }

        cachedDailyCoins[coin.symbol] = {
          symbol: coin.symbol,
          fullName: coin.fullName,
          daily: dailyData.map((entry) => ({
            date: new Date(entry.time * 1000).toLocaleDateString(),
            close: entry.close,
          })),
        };
      } catch (error) {
        console.error(
          `${coin.symbol} 데이터를 가져오는 중 오류 발생:`,
          error.message
        );
      }

      // 요청 간 딜레이 추가
      await delay(100); // 0.1초 (초당 10회 제한 대응)
    }

    console.log("모든 코인의 일별 데이터 업데이트 완료:", cachedDailyCoins);
  } catch (error) {
    console.error("일별 코인 데이터를 가져오는 중 오류 발생:", error.message);
  }
};

// -- 서버 시작 시 최초 한 번 실행
fetchDailyCoins().then(() => {
  console.log("Initial data fetch complete");
});

// -- 매일 00:00:00 마다 일별 데이터를 갱신
cron.schedule("0 0 * * *", () => {
  console.log("Cron job running: Fetching daily data at 00:00:00");
  fetchDailyCoins();
});

// 매 1분마다 호출
cron.schedule("*/10 * * * *", () => {
  fetchTopCoins();
});

// -- 라우트 핸들러
const getDailyCoins = (req, res) => {
  res.json({ success: true, data: cachedDailyCoins });
};

module.exports = {
  fetchDailyCoins,
  getDailyCoins,
};
