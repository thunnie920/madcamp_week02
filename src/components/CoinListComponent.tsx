"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Search from "@image/search.png";
import Selected from "@image/selected.png";
import Unselected from "@image/unselected.png";
import { motion } from "framer-motion";
import CustomScrollbar from "@components/CustomScrollbar";
import TextField from "@mui/material/TextField";

interface Coin {
  name: string;
  price: number;
  change: number;
  isFavorite: boolean;
}

export default function CoinListComponent() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch("/temp_coin.json"); // public 폴더 내 JSON 파일 경로
        const data: Coin[] = await response.json();
        // 정렬: isFavorite이 true인 코인을 상단에 배치
        const sortedData = data.sort(
          (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
        );
        setCoins(sortedData);
        setFilteredCoins(sortedData); // 초기 데이터 설정
      } catch (error) {
        console.error("Failed to fetch coin data:", error);
      }
    };

    fetchCoins();
  }, []);

  const handleFavoriteToggle = (index: number) => {
    const selectedCoin = filteredCoins[index]; // 클릭된 filteredCoins 항목
    setCoins((prevCoins) => {
      // coins 배열에서 해당 코인을 찾아 업데이트
      const updatedCoins = prevCoins.map((coin) =>
        coin.name === selectedCoin.name
          ? { ...coin, isFavorite: !coin.isFavorite }
          : coin
      );

      // 업데이트 후 정렬: isFavorite이 true인 코인은 위로, false인 코인은 아래로
      const sortedCoins = updatedCoins.sort(
        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
      );

      return sortedCoins;
    });

    // 필터된 코인 목록도 다시 업데이트
    setFilteredCoins((prevFilteredCoins) => {
      const updatedFilteredCoins = prevFilteredCoins.map((coin, i) =>
        i === index ? { ...coin, isFavorite: !coin.isFavorite } : coin
      );

      // 업데이트 후 정렬: isFavorite이 true인 코인은 위로, false인 코인은 아래로
      return updatedFilteredCoins.sort(
        (a, b) => Number(b.isFavorite) - Number(a.isFavorite)
      );
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const results = coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(results);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <CoinListContainer>
      <SearchContainer>
        <SearchButton onClick={handleSearch}>
          <Image
            src={Search}
            style={{ marginRight: "13px" }}
            alt="search"
            width={26}
            height={26}
          />
          <div style={{ width: "80%" }}>
            <TextField
              id="standard-search"
              type="search"
              variant="standard"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // 엔터 키 이벤트
              style={{ width: "100%" }}
            />
          </div>
        </SearchButton>
      </SearchContainer>
      <CustomScrollbar
        containerClassName="custom-scrollbar-container"
        style={{ display: "flex", width: "100%" }}
      >
        <CoinContainer>
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin, index) => (
              <Coin key={index} isSelected={coin.isFavorite}>
                <Image
                  src={coin.isFavorite ? Selected : Unselected}
                  alt={coin.isFavorite ? "selected" : "unselected"}
                  width={20}
                  style={{ marginLeft: "13px", cursor: "pointer" }}
                  onClick={() => handleFavoriteToggle(index)}
                />
                <CoinName>{coin.name}</CoinName>
                <CoinPrice
                  style={{ color: coin.change > 0 ? "#bc3a3a" : "#2c6be0" }}
                >
                  {coin.price.toLocaleString()}
                </CoinPrice>
                <CoinPricePercent
                  style={{ color: coin.change > 0 ? "#bc3a3a" : "#2c6be0" }}
                >
                  {coin.change > 0 ? `+${coin.change}%` : `${coin.change}%`}
                </CoinPricePercent>
              </Coin>
            ))
          ) : (
            <NoResults>검색 결과가 없습니다.</NoResults>
          )}
        </CoinContainer>
      </CustomScrollbar>
    </CoinListContainer>
  );
}

// 스타일 컴포넌트
const CoinListContainer = styled.div`
  height: 45vh;
  display: flex;
  width: 100%;
  border-radius: 5px;
  background-color: #f5f5f5;
  padding: 7px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 40px;
  gap: 20px;
  align-items: center;
  justify-content: flex-start;
`;

const CoinContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(45vh - 60px); /* 고정 높이 */
  margin-bottom: 10px;
  width: 100%;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto; /* 세로 스크롤 활성화 */
  padding-right: 10px; /* 스크롤바 여백 */
  box-sizing: content-box; /* 스크롤바로 인한 크기 변화 방지 */
`;

interface CoinProps {
  isSelected: boolean; // 선택 여부를 나타내는 속성
}

const Coin = styled.div<CoinProps>`
  display: flex;
  width: 100%;
  height: 50px;
  flex-shrink: 0;
  justify-content: space-between;
  border-radius: 5px;
  gap: 8px;
  align-items: center;
  background-color: #d9d9d9; /* 회색 배경 */
  box-sizing: border-box; /* 패딩을 포함한 박스 크기 계산 */
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const CoinName = styled.span`
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 400;
  color: #302d2d;
`;

const CoinPrice = styled.span`
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 600;
  color: #302d2d;
`;

const CoinPricePercent = styled.span`
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 600;
  color: #302d2d;
  padding-right: 13px;
`;

const SearchButton = styled.button`
  width: 100%;
  height: 40px;
  padding: 10px 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-start;
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

const NoResults = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  color: #302d2d;
  padding: 20px 0;
  align-items: center;
  justify-content: center;
`;
