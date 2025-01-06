import { scaleLinear } from "d3-scale";
import React, { useState, useEffect } from "react";

type CandleProps = {
  width: number;
  height: number;
  defaultLimit: number;
  dataLength: number;
  name: string;
};

export const CoinCandle: React.FC<CandleProps> = ({
  width,
  height,
  defaultLimit,
  dataLength,
  name,
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
              open: index > 0 ? arr[index - 1].close : item.close, // 이전 종가를 open으로 설정
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

  // --------- 기본 설정들 ----------
  const closePrices = data.map((item) => item.close);
  const dates = data.map((item) => item.date);
  const dataArray = dates.map((date, i) => [date, closePrices[i]]);

  const SVG_CHART_WIDTH = width;
  const SVG_CHART_HEIGHT = height;

  // 마진 (여백) 설정
  const MARGIN = { top: 10, right: 40, bottom: 20, left: 10 };
  const xAxisLength = SVG_CHART_WIDTH - MARGIN.left - MARGIN.right;
  const yAxisLength = SVG_CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  // 데이터의 최소, 최대값
  const dataYMax = Math.max(...closePrices);
  const dataYMin = Math.min(...closePrices);

  // 캔들(막대) 너비
  const barPlothWidth = xAxisLength / dataArray.length;

  // y축 스케일 (아래 → 위로 갈수록 값이 커지도록)
  const scaleY = scaleLinear()
    .domain([dataYMin, dataYMax]) // 데이터 범위
    .range([yAxisLength, 0]); // 픽셀 범위

  // 적당한 Tick(눈금) 생성
  const yTicks = scaleY.ticks(5);

  return (
    <svg width={SVG_CHART_WIDTH} height={SVG_CHART_HEIGHT}>
      {/* 차트 그룹 전체에 마진만큼 이동 */}
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        {/* X축(아래쪽) 라인 */}
        <line
          x1={0}
          y1={yAxisLength}
          x2={xAxisLength}
          y2={yAxisLength}
          stroke="gray"
        />

        {/* 
          변경 포인트: Y축을 오른쪽에 그립니다.
          xAxisLength로 이동한 다음, 세로 라인을 그려주세요.
        */}
        <line
          x1={xAxisLength}
          y1={0}
          x2={xAxisLength}
          y2={yAxisLength}
          stroke="gray"
        />

        {/* y축 Tick, Grid Line, 라벨 */}
        {yTicks.map((tickValue) => {
          const y = scaleY(tickValue);
          return (
            <g key={tickValue} transform={`translate(0, ${y})`}>
              {/* 
                오른쪽에서 왼쪽으로 가로선을 그립니다.
                x1={0}, x2={xAxisLength}라면 왼쪽->오른쪽이 되는데
                여기서는 오른쪽->왼쪽으로 그리려면 x1={xAxisLength}, x2={0}로 반대로.
                (어떻게 그려도 시각적 결과는 동일하지만, 헷갈리지 않도록 convention만 잘 정하세요)
              */}
              <line
                x1={0}
                x2={xAxisLength}
                stroke="#e0e0e0"
                strokeDasharray="2,2"
              />

              {/* Tick 라벨:
                  g를 y축 맨 오른쪽으로 이동한 상태(xAxisLength)에서
                  조금 오른쪽(예: +5px)으로 라벨을 배치합니다.
               */}
              <g transform={`translate(${xAxisLength}, 0)`}>
                <text
                  x={5}
                  dy="0.35em"
                  fill="black"
                  fontSize={12}
                  textAnchor="start"
                >
                  {tickValue.toFixed(2)} {/* 필요한 형식에 맞게 */}
                </text>
              </g>
            </g>
          );
        })}

        {/* 실제 캔들(직사각형) 그리기 */}
        {data.map((item, index) => {
          const x = index * barPlothWidth;
          const max = item.close;
          const min = index > 0 ? data[index - 1].close : item.close;

          return (
            <g key={index}>
              {/* 고가 ~ 저가 라인(이전 종가와 현재 종가를 이용) */}
              <line
                x1={x + barPlothWidth / 2}
                x2={x + barPlothWidth / 2}
                y1={scaleY(Math.min(min, max))}
                y2={scaleY(Math.max(min, max))}
                stroke="black"
              />
              {/* 캔들 본체 */}
              <rect
                x={x}
                width={barPlothWidth - 2}
                y={scaleY(Math.max(min, max))}
                height={scaleY(Math.min(min, max)) - scaleY(Math.max(min, max))}
                fill={max > min ? "#bc3a3a" : "#2c6be0"}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
