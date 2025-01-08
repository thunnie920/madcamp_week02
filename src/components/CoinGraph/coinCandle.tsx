import { scaleLinear } from "d3-scale";
import React, { useState, useEffect } from "react";

type CandleProps = {
  width: number;
  height: number;
  defaultLimit: number;
  dataLength: number;
  name: string;
  timeRange: string; // Time range
};

export const CoinCandle: React.FC<CandleProps> = ({
  width,
  height,
  defaultLimit,
  dataLength,
  name,
  timeRange,
}) => {
  const [data, setData] = useState<
    { date: string; close: number; open: number; high: number; low: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const endpoint = `http://localhost:4000/coinsprice/ohlcv/${timeRange
          .toLowerCase()
          .replace(/\d+\s*/, "")}`;
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        const timeKeyMap: Record<string, string> = {
          day: "daily",
          hour: "hourly",
          minute: "minute",
        };
        const timeKey =
          timeKeyMap[timeRange.toLowerCase().replace(/\d+\s*/, "")];

        if (result.success && result.data[name]?.[timeKey]) {
          const mappedData = result.data[name][timeKey].map(
            (item: {
              date: string;
              close: number;
              open?: number;
              high?: number;
              low?: number;
            }) => ({
              ...item,
              open: item.open ?? item.close,
              high: item.high ?? item.close,
              low: item.low ?? item.close,
            })
          );
          setData(mappedData.slice(-dataLength));
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name, dataLength, timeRange]);

  if (loading) return <p>Loading...</p>;
  if (data.length === 0) return <p>No data available for {name}.</p>;

  const closePrices = data.map((item) => item.close);
  const dates = data.map((item) => item.date);
  const dataArray = dates.map((date, i) => [date, closePrices[i]]);
  const dataYMax = Math.max(...closePrices);
  const dataYMin = Math.min(...closePrices);

  const SVG_CHART_WIDTH = width;
  const SVG_CHART_HEIGHT = height;
  const MARGIN = { top: 10, right: 40, bottom: 20, left: 10 };
  const xAxisLength = SVG_CHART_WIDTH - MARGIN.left - MARGIN.right;
  const yAxisLength = SVG_CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  const handleMouseEnter = (
    e: React.MouseEvent<SVGRectElement, MouseEvent>,
    item: {
      date: string;
      close: number;
      open: number;
      high: number;
      low: number;
    }
  ) => {
    const formattedDate = new Date(item.date).toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setTooltip({
      x: e.clientX,
      y: e.clientY,
      content: `Date: ${formattedDate}\nOpen: $${item.open}\nClose: $${item.close}\nHigh: $${item.high}\nLow: $${item.low}`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  // 캔들(막대) 너비
  const barPlothWidth = xAxisLength / dataArray.length;

  // y축 스케일 (아래 → 위로 갈수록 값이 커지도록)
  const scaleY = scaleLinear()
    .domain([dataYMin, dataYMax]) // 데이터 범위
    .range([yAxisLength, 0]); // 픽셀 범위

  // 적당한 Tick(눈금) 생성
  const yTicks = scaleY.ticks(5);

  return (
    <div style={{ position: "relative" }}>
      <svg width={SVG_CHART_WIDTH} height={SVG_CHART_HEIGHT}>
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

          {/* Draw the candlesticks */}
          {data.map((item, index) => {
            const x = index * barPlothWidth;
            const max = Math.max(item.open, item.close);
            const min = Math.min(item.open, item.close);
            const fill = item.close > item.open ? "#bc3a3a" : "#2c6be0";
            return (
              <g key={index}>
                {/* High-Low line */}
                <line
                  x1={x + barPlothWidth / 2}
                  x2={x + barPlothWidth / 2}
                  y1={scaleY(item.low)}
                  y2={scaleY(item.high)}
                  stroke={fill}
                  strokeWidth={2} // 선의 굵기를 설정
                />
                {/* Candlestick body */}
                <rect
                  x={x}
                  width={barPlothWidth - 2}
                  y={scaleY(max)}
                  height={scaleY(min) - scaleY(max)}
                  fill={fill}
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            );
          })}
        </g>
      </svg>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y - 150,
            left: tooltip.x - 150,
            backgroundColor: "rgba(240, 240, 240, 0.8)",
            padding: "5px",
            borderRadius: "4px",
            pointerEvents: "none",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <pre>{tooltip.content}</pre>
        </div>
      )}
    </div>
  );
};
