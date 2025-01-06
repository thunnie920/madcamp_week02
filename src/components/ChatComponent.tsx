"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import NewPerson from "@image/newPerson.png";
import TextField from "@mui/material/TextField";

// 메시지 타입 정의
interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  message: string;
  time: string;
}

export default function ChatComponent() {
  const [input, setInput] = useState(""); // 사용자 입력 상태
  const [messages, setMessages] = useState<Message[]>([]); // 메시지 상태 관리
  const [currentUserId, setCurrentUserId] = useState(""); // 현재 사용자 ID
  const [isComposing, setIsComposing] = useState(false);

  const nameMap = new Map<string, string>(); // 익명 사용자 이름 매핑

  // 무작위 이름 생성 함수
  const generateRandomName = () => {
    const adjectives = [
      "피자를 먹는",
      "책을 읽는",
      "물을 마시는",
      "수영을 하는",
      "잠을 자는",
      "씩씩거리는",
      "웃고있는",
      "울고있는",
      "점프를 하는",
      "넘어지는",
      "달리는",
      "차를 모는",
      "기어다니는",
    ];
    const nouns = [
      "여우",
      "판다",
      "요정",
      "공주",
      "왕자",
      "북극곰",
      "대나무",
      "장미",
      "책상",
      "의자",
      "침대",
      "안경",
      "돌고래",
      "바다",
      "숲",
      "산",
      "호랑이",
      "넙죽이",
    ];
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective} ${randomNoun}`;
  };

  // senderId로 이름을 가져오거나 생성
  const getSenderName = (senderId: string) => {
    if (!nameMap.has(senderId)) {
      nameMap.set(senderId, generateRandomName());
    }
    return nameMap.get(senderId) as string;
  };

  // JSON 데이터 fetch
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/temp_chat.json"); // public 폴더 내 JSON 파일 경로
        const data = await response.json();
        const updatedMessages = data.chatRoom.messages.map((msg: Message) => ({
          ...msg,
          senderName: getSenderName(msg.senderId), // 무작위 이름 설정
        }));
        setMessages(updatedMessages);
        setCurrentUserId(data.chatRoom.currentUserId);
      } catch (error) {
        console.error("JSON 파일 불러오기 실패:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleCompositionStart = () => {
    setIsComposing(true); // IME 입력 시작
  };

  const handleCompositionEnd = () => {
    setIsComposing(false); // IME 입력 완료
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (isComposing) return;

    if (event.key === "Enter" && input.trim()) {
      event.preventDefault();
      const userMessage = {
        messageId: `msg_${messages.length + 1}`,
        senderId: currentUserId,
        senderName: "You",
        message: input,
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
    }
  };

  return (
    <ChatContainer>
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
            <MessageContainer
              key={msg.messageId || index}
              role={msg.senderId === currentUserId ? "user" : "other"}
            >
              {msg.senderId !== currentUserId && (
                <OtherIcon>
                  <Image src={NewPerson} alt="person" width={30} height={30} />
                </OtherIcon>
              )}
              <div
                style={{ flexDirection: "column", gap: "2px", display: "flex" }}
              >
                {msg.senderId !== currentUserId ? (
                  <NameText>{msg.senderName}</NameText>
                ) : (
                  <></>
                )}
                <div
                  style={{ flexDirection: "row", gap: "5px", display: "flex" }}
                >
                  {msg.senderId !== currentUserId ? (
                    <>
                      <TextContainer
                        role={msg.senderId === currentUserId ? "user" : "other"}
                      >
                        {msg.message}
                      </TextContainer>
                      <TimeText>
                        {new Date(msg.time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // 12시간제 표시
                        })}
                      </TimeText>
                    </>
                  ) : (
                    <>
                      <TimeText>
                        {new Date(msg.time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true, // 12시간제 표시
                        })}
                      </TimeText>

                      <TextContainer
                        role={msg.senderId === currentUserId ? "user" : "other"}
                      >
                        {msg.message}
                      </TextContainer>
                    </>
                  )}
                </div>
              </div>
            </MessageContainer>
          ))}
        </div>
      </ChatAreaContainer>
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
            placeholder="대화를 나눠보세요..."
            style={{ width: "100%", marginBottom: "5px" }}
          />
        </div>
      </InputArea>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
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
`;

const NameText = styled.div`
  dispaly: flex;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 12px;
  font-weight: 400;
`;

const TimeText = styled.div`
  dispaly: flex;
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 10px;
  font-weight: 200;
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

const OtherIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: transparent;
  border-radius: 5px;
  margin-bottom: 10px; /* 메시지 간 하단 간격 */
`;
