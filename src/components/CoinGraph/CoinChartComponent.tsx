import React, { useState, useEffect, useRef } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { CoinCandle } from "@components/CoinGraph/coinCandle";

export const CoinChartComponent: React.FC = () => {
  const [name, setName] = useState("BTC");
  const [defaultLimit, setDefaultLimit] = useState(1000);
  const [dataLength, setDataLength] = useState(900);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
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

  const onClickListener = () => {
    setName("ETH");
  };

  const loadDataHandler = () => {
    setDefaultLimit(defaultLimit + 500);
  };

  return (
    <div
      ref={containerRef}
      style={{
        /* 부모가 flex:1로 주어졌으니 100%로 채우면 됩니다 */
        width: "100%",
        height: "100%",
        display: "flex",
        /* 차트를 화면에 가득 채우고 싶다면 가운데 정렬 대신 다음처럼 수정:
           justifyContent: "center",
           alignItems: "center",
           을 제거하고 그냥 꽉 채우도록 할 수도 있습니다. */
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {dimensions.width > 0 && dimensions.height > 0 ? (
        <CoinCandle
          width={dimensions.width}
          height={dimensions.height}
          defaultLimit={defaultLimit} // 추가
          dataLength={dataLength} // 추가
          name={name} // 추가
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CoinChartComponent;
