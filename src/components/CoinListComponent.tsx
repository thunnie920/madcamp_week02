"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Image from "next/image";
import Search from "@image/search.png";
import Selected from "@image/selected.png";
import Unselected from "@image/unselected.png";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import { Spinner } from "basic-loading";

interface Coin {
  fullName: string;
  price: number;
  symbol: string;
  changePct24Hour: number;
  isFavorite: boolean;
}

export default function CoinListComponent() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [userId, setUserId] = useState<string | null>(null); // 사용자 ID 상태 추가

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:4000/auth/profile", {
          credentials: "include", // 쿠키 포함
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch user profile: ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Fetched profile data:", data); // 응답 데이터 확인
        setUserId(data.user._id); //
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const callCoinApi = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        const response = await axios.get(
          "http://localhost:4000/volumelist/top-coins"
        );
        console.log("API Response:", response.data); // 응답 데이터 확인
        const data: Coin[] = response.data.data;

        // 데이터가 배열인지 확인
        if (!Array.isArray(data)) {
          throw new Error("API response is not an array");
        }

        const sortedData = data.sort(
          (a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
        );
        setCoins(sortedData);
        setFilteredCoins(sortedData);
      } catch (error) {
        console.error("Failed to fetch coin data:", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    callCoinApi();
  }, []);

  const handleFavoriteToggle = async (
    symbol: string,
    fullName: string,
    isFavorite: boolean
  ) => {
    if (!userId) {
      console.error("User ID not available");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/favorites/toggle",
        {
          symbol,
          fullName,
          isFavorite,
          user: userId,
        }
      );

      // 상태 업데이트
      setCoins((prevCoins) =>
        prevCoins.map((coin) =>
          coin.symbol === symbol ? { ...coin, isFavorite: !isFavorite } : coin
        )
      );
      console.log("Favorite toggled successfully:", response.data);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const results = coins.filter((coin) =>
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
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
      <CoinContainer>
        {isLoading ? ( // 로딩 상태 확인
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Spinner
              option={{
                size: 30,
                bgColor: "#bc3a3a",
                barColor: "#d9d9d9",
                thickness: 4,
              }}
            />
          </div>
        ) : filteredCoins.length > 0 ? (
          filteredCoins.map((coin, index) => (
            <Coin key={index} isSelected={coin.isFavorite}>
              <Image
                src={coin.isFavorite ? Selected : Unselected}
                alt={coin.isFavorite ? "selected" : "unselected"}
                width={20}
                style={{ marginLeft: "13px", cursor: "pointer" }}
                onClick={() =>
                  handleFavoriteToggle(
                    coin.symbol,
                    coin.fullName,
                    coin.isFavorite
                  )
                }
              />
              <CoinName>{coin.symbol}</CoinName>{" "}
              <CoinPrice
                style={{
                  color: coin.changePct24Hour > 0 ? "#bc3a3a" : "#2c6be0",
                }}
              >
                {" "}
                $
                {coin.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </CoinPrice>
              <CoinPricePercent
                style={{
                  color: coin.changePct24Hour > 0 ? "#bc3a3a" : "#2c6be0",
                }}
              >
                {coin.changePct24Hour > 0
                  ? `+${coin.changePct24Hour.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%`
                  : `${coin.changePct24Hour.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}%`}
              </CoinPricePercent>
            </Coin>
          ))
        ) : (
          <NoResults>검색 결과가 없습니다.</NoResults>
        )}
      </CoinContainer>
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
  height: calc(100% - 60px); /* 고정 높이 */
  margin-bottom: 3px;
  width: 100%;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  /* 스크롤 관련 설정 */
  max-height: calc(100% - 50px); /* 드롭다운의 최대 높이 설정 */
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
  padding: 0 10px; /* 좌우 여백 추가 */
`;

const CoinName = styled.span`
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 400;
  color: #302d2d;
  text-align: center; /* 왼쪽 정렬 */
  flex: 1; /* 동등한 공간 차지 */
`;

const CoinPrice = styled.span`
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 600;
  color: #302d2d;
  text-align: center; /* 오른쪽 정렬 */
  flex: 1.2; /* 더 많은 공간 차지 */
`;

const CoinPricePercent = styled.span`
  font-size: 18px;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-weight: 600;
  color: #302d2d;
  padding-right: 13px;
  text-align: center; /* 오른쪽 정렬 */
  flex: 0.8; /* 적당한 공간 차지 */
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
