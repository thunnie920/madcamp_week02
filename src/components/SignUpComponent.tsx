"use client";
import styled from "styled-components";
import { easeIn, motion } from "framer-motion";

export default function SignUpComponent() {
  const kakaoLogin = () => {
    console.log("카카오 로그인 버튼 클릭됨!");
    alert("카카오 로그인 버튼 클릭됨!");
  };

  return (
    <SignUpContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: easeIn }}
    >
      <WelcomeTitle>
        지금 회원가입 하신 후 FF0000에서 서비스를 경험해보세요
      </WelcomeTitle>
      <SignUpBtn className="kakao" onClick={kakaoLogin}>
        카카오로 가입
      </SignUpBtn>
    </SignUpContainer>
  );
}

const SignUpContainer = styled(motion.div)`
  display: flex;
  width: 60%;
  height: 100vh;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  gap: 41px;
`;

const WelcomeTitle = styled.div`
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 36px;
  font-weight: 600;
  color: #302d2d;
  margin: 0;
  text-align: center;
  width: 100%;
`;

const SignUpBtn = styled.button`
  width: 100%;
  padding: 10px 20px; /* 버튼 내부 여백 */
  height: 84px;
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
  font-size: 40px;

  &.kakao {
    background: #fee500;
    color: #391c1c;
    font-weight: 600;
  }
`;
