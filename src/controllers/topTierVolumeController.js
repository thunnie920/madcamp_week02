const axios = require("axios");
const topTierVolumeConfig = require("../config/topTierVolume");
const cron = require("node-cron");

let cachedTopCoins = [];

// cachedTopCoins를 가져가는 Getter 함수
const getCachedTopCoins = () => cachedTopCoins;

// 데이터 가져오는 함수
const fetchTopCoins = async () => {
  try {
    const response = await axios.get(
      `${topTierVolumeConfig.baseURL}/top/totaltoptiervolfull`,
      {
        params: {
          limit: topTierVolumeConfig.limit,
          tsym: topTierVolumeConfig.defaultCurrency,
        },
        headers: {
          authorization: `Apikey ${topTierVolumeConfig.apiKey}`, // API 키를 헤더에 추가
        },
      }
    );

    // 실제 응답 구조가 어떻게 생겼는지 확인
    console.log("response.data:", response.data);

    const topCoinsData = response.data.Data;

    // 배열인지 먼저 체크
    if (!topCoinsData || !Array.isArray(topCoinsData)) {
      console.error("Top coins 데이터가 배열이 아닙니다:", topCoinsData);
      return;
    }

    cachedTopCoins = topCoinsData.map((coin) => ({
      symbol: coin.CoinInfo.Name,
      fullName: coin.CoinInfo.FullName,
      price: coin.RAW[topTierVolumeConfig.defaultCurrency].PRICE,
      changePct24Hour:
        coin.RAW[topTierVolumeConfig.defaultCurrency].CHANGEPCT24HOUR,
      volume24Hour:
        coin.RAW[topTierVolumeConfig.defaultCurrency].TOTALVOLUME24HTO,
    }));

    console.log("Updated top coins data:", cachedTopCoins);
  } catch (error) {
    console.error("Error fetching top coins:", error.message);
  }
};

// 매 30초마다 실행하는 크론 작업
cron.schedule("*/10 * * * * *", () => {
  fetchTopCoins();
});

// 라우트에서 캐시된 데이터를 반환
const getTopCoins = (req, res) => {
  res.json({ success: true, data: cachedTopCoins });
};

module.exports = {
  fetchTopCoins, // 필요 시 직접 호출 가능
  getTopCoins, // 라우트 핸들러
  getCachedTopCoins, // 다른 모듈에서 현재 상태만 조회할 때 사용
};
