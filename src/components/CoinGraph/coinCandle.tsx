import { scaleLinear } from "d3-scale";
import React, { useState, useEffect } from "react";

type CandleProps = {
  width: number | undefined;
  height: number | undefined;
  defaultLimit: number | undefined;
  dataLength: number | undefined;
  name: string | undefined;
};

export const CoinCandle: React.FC<CandleProps> = ({
  width = 600,
  height = 400,
  defaultLimit = 100,
  dataLength = 90,
  name = "BTC",
}) => {
  const [data, setData] = useState<
    { date: string; close: number; open: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/dailycoins/daily-coins`
        );
        const result = await response.json();

        if (result.success && result.data[name]) {
          const dailyData = result.data[name].daily.map(
            (item: any, index: number, arr: any[]) => ({
              ...item,
              open: index > 0 ? arr[index - 1].close : item.close, // 이전 종가를 open으로 계산
            })
          );
          setData(dailyData.slice(-dataLength));
        } else {
          console.error("No data available for the selected coin.");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [name, dataLength]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return <p>No data available for {name}.</p>;
  }

  // 데이터 처리
  const closePrices = data.map((item) => item.close);
  const dates = data.map((item) => item.date);

  const dataArray = dates.map((date, i) => [date, closePrices[i]]);

  // Chart dimensions
  const SVG_CHART_WIDTH = width;
  const SVG_CHART_HEIGHT = height;

  const xAxisLength = SVG_CHART_WIDTH - 75;
  const yAxisLength = SVG_CHART_HEIGHT * 0.94;

  const dataYMax = Math.max(...closePrices);
  const dataYMin = Math.min(...closePrices);

  const barPlothWidth = xAxisLength / dataArray.length;

  const scaleY = scaleLinear()
    .domain([dataYMin, dataYMax])
    .range([yAxisLength, 0]);

  return (
    <svg width={SVG_CHART_WIDTH} height={SVG_CHART_HEIGHT}>
      {/* X축 */}
      <line
        x1={0}
        y1={yAxisLength}
        x2={xAxisLength}
        y2={yAxisLength}
        stroke="gray"
      />
      {/* Y축 */}
      <line
        x1={xAxisLength}
        y1={0}
        x2={xAxisLength}
        y2={yAxisLength}
        stroke="gray"
      />
      {data.map((item, index) => {
        const x = index * barPlothWidth;
        const max = item.close; // 현재 close를 max로 설정
        const min = index > 0 ? data[index - 1].close : item.close; // 전날 close를 min으로 설정

        return (
          <g key={index}>
            {/* High-Low 선 */}
            <line
              x1={x + barPlothWidth / 2}
              x2={x + barPlothWidth / 2}
              y1={scaleY(min)}
              y2={scaleY(max)}
              stroke="black"
            />
            {/* 상승/하락 캔들 */}
            <rect
              x={x}
              width={barPlothWidth - 2}
              y={scaleY(Math.max(min, max))} // 더 높은 값을 기준으로 Y 시작
              height={scaleY(Math.min(min, max)) - scaleY(Math.max(min, max))} // 높이 계산
              fill={max > min ? "#bc3a3a" : "#2c6be0"} // 상승/하락 색상 설정
            />
            {/* 날짜 라벨 */}
            {index % 5 === 0 && (
              <text
                x={x + 15} // x축 기준으로 10px 오른쪽으로 이동
                y={yAxisLength + 15} // y 위치
                fontSize="10"
                fontFamily="'Spoqa Han Sans Neo', sans-serif" // 올바른 속성 이름
                fontWeight="300" // 올바른 속성 이름
                fill="#302d2d" // 'color' 대신 'fill' 사용
                textAnchor="start" // 왼쪽 정렬
              >
                {item.date}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
