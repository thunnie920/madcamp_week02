"use client";
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import Gptlogo from "@image/gptlogo.png";
import TextField from "@mui/material/TextField";
import CustomScrollbar from "@components/CustomScrollbar";

export default function AIChatComponent() {
  const [input, setInput] = useState(""); // 사용자 입력 상태
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [{ role: "system", content: "안녕하세요! 무엇을 도와드릴까요?" }]
  ); // 대화 상태 관리
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true); // IME 입력 시작
  };

  const handleCompositionEnd = () => {
    setIsComposing(false); // IME 입력 완료
  };

  // Mock API 호출 (테스트용)
  const mockApiCall = (userMessage: string) => {
    return new Promise<{ content: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          content: `GPT 응답: "${userMessage}"에 대한 답변입니다.`,
        });
      }, 1000); // 1초 지연 후 응답
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (isComposing) return; // IME 조합 중이면 무시

    if (event.key === "Enter" && input.trim()) {
      event.preventDefault(); // 기본 동작 방지
      const userMessage = { role: "user", content: input }; // 사용자 메시지
      setMessages((prev) => [...prev, userMessage]); // 사용자 메시지를 대화에 추가
      setInput(""); // 입력 필드 초기화

      // Mock API 호출
      try {
        const response = await mockApiCall(input); // 실제 API 호출 시 여기를 변경
        const gptMessage = { role: "assistant", content: response.content }; // GPT 응답 메시지
        setMessages((prev) => [...prev, gptMessage]); // GPT 응답을 대화에 추가
      } catch (error) {
        console.error("Mock API 호출 실패", error);
      } finally {
      }
    }
  };

  return (
    <AIChatContainer>
      <CustomScrollbar
        containerClassName="custom-scrollbar-container"
        style={{ display: "flex", width: "100%" }}
      >
        <ChatAreaContainer>
          <div
            style={{
              flexDirection: "row",
              gap: "6px",
              paddingBottom: "6px",
              width: "100%",
            }}
          >
            {messages.map((msg, index) => (
              <MessageContainer key={index} role={msg.role}>
                {(msg.role === "assistant" || msg.role === "system") && (
                  <GPTIcon>
                    <Image
                      src={Gptlogo}
                      style={{ marginRight: "13px" }}
                      alt="gptlogo"
                    />
                  </GPTIcon>
                )}

                <TextContainer role={msg.role}>{msg.content}</TextContainer>
              </MessageContainer>
            ))}
          </div>
        </ChatAreaContainer>
      </CustomScrollbar>
      <InputArea>
        <div style={{ width: "80%", display: "flex" }}>
          <TextField
            id="standard-search"
            type="search"
            variant="standard"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="질문을 입력하세요..."
            style={{ width: "100%", marginBottom: "5px" }}
          />
        </div>
      </InputArea>
    </AIChatContainer>
  );
}

const AIChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 7px;
  height: 45vh;
  border-radius: 5px;
  background-color: #f5f5f5;
  padding: 7px;
`;

const InputArea = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  color: #302d2d;
  background-color: #d9d9d9;
  margin-top: auto;
`;

const TextContainer = styled.div<{ role: string }>`
  display: inline-block; /* 말풍선의 크기를 내용에 맞춤 */
  max-width: 400px; /* 최대 너비를 400px로 제한 */
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ role }) => (role === "user" ? "#f8d7da" : "#d9d9d9")};
  color: #302d2d;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 12px;
  font-weight: 400;
  word-wrap: break-word; /* 긴 단어 줄바꿈 */
  word-break: break-word; /* 단어가 길 경우 줄바꿈 */
  white-space: pre-wrap; /* 공백과 줄바꿈 유지 */
`;

const MessageContainer = styled.div<{ role: string }>`
  display: flex;
  flex-direction: ${({ role }) =>
    role === "user" ? "row-reverse" : "row"}; /* 사용자 메시지는 오른쪽 정렬 */
  gap: 7px;
  max-width: 100%; /* 부모 컨테이너의 너비에 맞춤 */
  align-items: flex-start; /* 말풍선을 상단 정렬 */
  margin-bottom: 10px; /* 메시지 간 하단 간격 */
`;

const ChatAreaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(45vh - 54px); /* 고정 높이 */
  margin-bottom: 10px;
  width: 100%;
  gap: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto; /* 세로 스크롤 활성화 */
  box-sizing: border-box; /* 크기 계산에 패딩과 스크롤바 포함 */
  padding-right: 10px; /* 스크롤바 공간 추가 */
`;

const GPTIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: #bc3a3a;
  border-radius: 5px;
  margin-bottom: 10px; /* 메시지 간 하단 간격 */
`;
