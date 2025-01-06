import React, { useState, useEffect, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { CoinCandle } from "@components/CoinGraph/coinCandle";

// 타입 정의
interface CoinChartComponentProps {
  selectedCoin: string;
  selectedTime: string; // 추가
  dataLimit: number;
}

export const CoinChartComponent: React.FC<CoinChartComponentProps> = ({
  selectedCoin,
  selectedTime,
  dataLimit,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          const { width, height } = entries[0].contentRect;
          setDimensions({ width, height });
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "95%",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <CoinCandle
          width={dimensions.width}
          height={dimensions.height}
          defaultLimit={dataLimit}
          dataLength={dataLimit}
          name={selectedCoin}
          timeRange={selectedTime}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CoinChartComponent;
