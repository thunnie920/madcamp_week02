"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import Dropdown from "@image/dropdown.png";
import { motion } from "framer-motion";
import CustomScrollbar from "./CustomScrollbar";
import TextField from "@mui/material/TextField";

export default function ChatComponent() {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {};

  return (
    <ChatContainer>
      <InputArea>
        <div style={{ width: "80%", display: "flex" }}>
          <TextField
            id="standard-search"
            type="search"
            variant="standard"
            onKeyDown={handleKeyDown} // 엔터 키 이벤트
            style={{ width: "100%", marginBottom: "5px" }}
          />
        </div>
      </InputArea>
    </ChatContainer>
  );
}

// 스타일 컴포넌트
const ChatContainer = styled.div`
  height: 45vh;
  display: flex;
  width: 100%;
  border-radius: 5px;
  background-color: pink;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding: 7px;
`;

const InputArea = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: gray;
  margin-top: auto;
`;

const ProfileIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: #bc3a3a;
  border-radius: 5px;
`;

const TextBox = styled.button`
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
