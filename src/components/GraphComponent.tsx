"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Dropdown from "@image/dropdown.png";
import { motion } from "framer-motion";

interface Coin {
  name: string;
  price: number;
  change: number;
  isFavorite: boolean;
}

export default function GraphComponent() {
  const [selected, setSelected] = useState<string>("1 Year"); // 기본 선택 값

  const handleSelect = (value: string) => {
    setSelected(value); // 선택된 버튼 상태 업데이트
  };

  const timeOptions: string[] = [
    "1 Year",
    "1 Month",
    "1 Week",
    "1 Day",
    "1 Hour",
    "1 Minute",
    "1 Second",
  ];

  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
  const [selectedOption, setSelectedOption] = useState<string>("BTC"); // 선택된 옵션
  const [options, setOptions] = useState<string[]>([]); // 옵션 리스트

  useEffect(() => {
    // JSON 데이터 가져오기
    const fetchOptions = async () => {
      try {
        const response = await fetch("/temp_coin.json");
        const data: Coin[] = await response.json(); // JSON 데이터를 Coin[] 타입으로 지정
        const uniqueNames = [...new Set(data.map((item) => item.name))]; // 중복 제거
        setOptions(uniqueNames);
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    };

    fetchOptions();
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
    </GraphContainer>
  );
}

const GraphContainer = styled.div`
  margin-top: calc(64px + 10px);
  display: flex;
  height: 41vh;
  border-radius: 5px;
  background-color: green;
  padding: 7px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const TimeBtnContainer = styled(motion.div)`
  display: flex;
  width: 10%;
  height: 100%; /* Stretch to match parent height */
  flex-direction: column;
  justify-content: space-evenly; /* Evenly distribute buttons */
  gap: 10px; /* Space between buttons */
`;

interface TimeBtnProps {
  isSelected: boolean;
}

const TimeBtn = styled.button<TimeBtnProps>`
  width: 100%;
  height: auto; /* Adjust height dynamically if needed */
  flex-grow: 1; /* Make buttons grow proportionally */
  padding: 10px 20px;
  text-align: center;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  line-height: 20px;
  letter-spacing: -0.06em;
  border: none;
  user-select: none;
  font-size: 15px;
  font-weight: 700;
  background-color: ${({ isSelected }) =>
    isSelected ? "#bc3a3a" : "#e0e0e0"}; /* Selection color */
  color: ${({ isSelected }) =>
    isSelected ? "#e0e0e0" : "#302d2d"}; /* Selection font color */
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const DropDownContainer = styled.div`
  position: relative;
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
