"use client";
import { useEffect, useState } from "react";
import TopBar from "@components/TopBar";
import GraphComponent from "@components/GraphComponent";
import CoinListComponent from "@components/CoinListComponent";
import ChatComponent from "@components/ChatComponent";
import AIChatComponent from "@components/AIChatComponent";

export default function Main() {
  /*const [user, setUser] = useState(null);

  useEffect(() => {
    // 백엔드에서 사용자 데이터 요청
    fetch("http://localhost:4000/auth/profile", {
      credentials: "include", // 쿠키를 포함해 인증 정보 전달
    })
      .then((res) => {
        if (res.status === 401) {
          // 인증 실패 시 로그인 페이지로 이동
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        }
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch((err) => console.error("데이터 가져오기 실패:", err));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }*/
  return (
    <div style={{ minWidth: "1000px" }}>
      <div>
        <TopBar />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <GraphComponent />
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <ChatComponent />
          <CoinListComponent />
          <AIChatComponent />
        </div>
      </div>
    </div>
  );
}
