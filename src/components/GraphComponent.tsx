"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Dropdown from "@image/dropdown.png";
import { motion } from "framer-motion";
import axios from "axios";
import CoinChart, {
  CoinChartComponent,
} from "@components/CoinGraph/CoinChartComponent";

interface Coin {
  fullName: string;
  price: number;
  symbol: string;
  changePct24Hour: number;
  isFavorite: boolean;
}

export default function GraphComponent() {
  const [selected, setSelected] = useState<string>("1 Year"); // 기본 선택 값

  const handleSelect = (value: string) => {
    setSelected(value); // 선택된 버튼 상태 업데이트
  };

  const timeOptions: string[] = ["1 Day", "1 Hour", "1 Minute"];

  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
  const [selectedOption, setSelectedOption] = useState<string>("BTC"); // 선택된 옵션
  const [options, setOptions] = useState<string[]>([]); // 옵션 리스트

  useEffect(() => {
    // coin api 가져오기
    const callCoinSymbolApi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/volumelist/top-coins"
        );
        const data: Coin[] = response.data.data;
        const uniqueSymbols = [...new Set(data.map((item) => item.symbol))]; // 중복 제거
        setOptions(uniqueSymbols);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    callCoinSymbolApi();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen); // 드롭다운 토글 함수

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option); // 선택된 옵션 업데이트
    setIsOpen(false); // 드롭다운 닫기
  };

  return (
    <GraphContainer>
      <TimeBtnContainer>
        {timeOptions.map((item) => (
          <TimeBtn
            key={item}
            isSelected={selected === item} // 선택된 버튼인지 확인
            onClick={() => handleSelect(item)} // 버튼 클릭 시 상태 업데이트
          >
            {item}
          </TimeBtn>
        ))}
      </TimeBtnContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "relative", // 드롭다운과 차트를 겹칠 수 있도록 relative 설정
            flex: 1, // 남은 공간을 채우도록 설정
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {/* CoinChartComponent에 selectedOption을 props로 전달 */}
          <CoinChartComponent selectedCoin={selectedOption} dataLimit={1000} />

          <DropDownContainer>
            <DropdownButton onClick={toggleDropdown}>
              <span>{selectedOption}</span>
              <Image src={Dropdown} alt="dropdown" width={20} height={20} />
            </DropdownButton>
            {isOpen && (
              <OptionsContainer>
                {options.map((option) => (
                  <Option
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    isSelected={selectedOption === option}
                  >
                    {option}
                  </Option>
                ))}
              </OptionsContainer>
            )}
          </DropDownContainer>
        </div>
      </div>
    </GraphContainer>
  );
}

const GraphContainer = styled.div`
  margin-top: calc(64px + 10px);
  display: flex;
  height: 40vh;
  border-radius: 5px;
  background-color: #f5f5f5;
  padding: 7px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
`;

const TimeBtnContainer = styled(motion.div)`
  display: flex;
  width: 10%;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

interface TimeBtnProps {
  isSelected: boolean;
}

const TimeBtn = styled.button<TimeBtnProps>`
  width: 100%;
  height: calc((100% - 50px) / 7); /* 간격 포함한 버튼 비율 조정 */
  padding: 10px 20px;
  margin-bottom: 10px;
  text-align: center;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  display: flex;
  justify-content: center;
  border: none;
  align-items: center;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 700;
  background-color: ${({ isSelected }) => (isSelected ? "#bc3a3a" : "#f0f0f0")};
  color: ${({ isSelected }) => (isSelected ? "#f0f0f0" : "#302d2d")};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:last-child {
    margin-bottom: 5px;
  }
`;

const DropDownContainer = styled.div`
  position: absolute;
  display: flex;
  width: 20%;
  height: 100%;
  align-items: flex-start;
  justify-content: flex-start;
`;

const DropdownButton = styled.button`
  width: 100%;
  height: 40px;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 20px;
  font-weight: 600;
  font-color: #302d2d;
  align-self: flex-start;
`;

const OptionsContainer = styled.ul`
  position: absolute;
  left: 0;
  top: 40px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 0px 0px 10px 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 10px 0;
  z-index: 100;

  /* 스크롤 관련 설정 */
  max-height: calc(100% - 60px); /* 드롭다운의 최대 높이 설정 */
  overflow-y: auto; /* 컨텐츠가 넘치면 세로 스크롤 활성화 */

  &::-webkit-scrollbar {
    width: 0px; /* 스크롤바 너비 (Chrome, Edge, Safari) */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #f0f0f0; /* 스크롤바 색상 */
    border-radius: 5px; /* 스크롤바 모서리 둥글게 */
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; /* 스크롤바 트랙 배경 */
  }
`;

const Option = styled.li<{ isSelected: boolean }>`
  padding: 10px 15px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 16px;
  color: ${({ isSelected }) => (isSelected ? "#bc3a3a" : "#302d2d")};
  font-weight: ${({ isSelected }) => (isSelected ? "bold" : "normal")};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ffe6e6; /* 커서 올릴 때 항상 동일한 배경색 */
  }
`;
