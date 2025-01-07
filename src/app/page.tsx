"use client"; // 클라이언트 컴포넌트 설정
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 라우터 훅
import TopBar from "@components/TopBar";
import GraphComponent from "@components/GraphComponent";
import CoinListComponent from "@components/CoinListComponent";
import ChatComponent from "@components/ChatComponent";
import AIChatComponent from "@components/AIChatComponent";
import Graph from "@image/graph.png";
import Image from "next/image";
import { easeIn, easeInOut, motion } from "framer-motion";

export default function MainPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트가 마운트되면 로그인 여부 확인
  useEffect(() => {
    fetch("http://localhost:4000/auth/profile", {
      credentials: "include", // 쿠키 포함 전송
    })
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch((err) => console.error("데이터 가져오기 실패:", err))
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    // 유저 정보를 가져오는 동안 로딩 화면
    return (
      <div>
        <LogoContainer
          initial={{
            opacity: 0,
            y: +90,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 1.2, ease: easeInOut }}
        >
          <Image src={Graph} alt="graph" />
        </LogoContainer>
      </div>
    );
  }

  // 로그인 확인 후 렌더링할 메인 페이지 내용
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

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  img {
    width: 100%;
    height: 100%;
  }
`;
