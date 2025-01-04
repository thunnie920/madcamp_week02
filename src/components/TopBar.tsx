"use client";

import { styled } from "styled-components";
import Link from "next/link";
import Image from "next/image";
import Logo from "@image/logo.png";
import { easeInOut, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

  return (
    <TopBarWrapper
      className="MainTopBarWrapper"
      initial={pathname === "/" ? { opacity: 0, y: -90 } : undefined}
      animate={pathname === "/" ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 1.2, ease: easeInOut }}
    >
      <LogoContainer>
        <Image src={Logo} alt="logo" />
      </LogoContainer>
      <Title>FF0000</Title>
      <NavContainer>
        {pathname !== "/" && pathname !== "/signup" && (
          <Link
            href="/signup"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <NavItem>회원가입</NavItem>
          </Link>
        )}
        <Link
          href="/login"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <NavItem>로그인</NavItem>
        </Link>
      </NavContainer>
    </TopBarWrapper>
  );
}

const TopBarWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: #bc3a3a;
  display: flex;
  align-items: center;
  padding: 0px 40px;
  gap: 40px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
  margin-bottom: 0px;

  @media (max-width: 768px) {
    padding: 0 16px; /* 모바일 화면에서 패딩 추가 조정 */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  img {
    width: 70px;
    height: 70px;
  }
`;

const Title = styled.h1`
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 50px;
  font-weight: 700;
  color: white;
  margin: 0;
  width: 70%; /* 퍼센트로 설정 */
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 30px;
    width: 50%; /* 모바일 화면에서 비율 조정 */
  }
`;

const NavContainer = styled.div`
  display: flex;
  gap: 20px; /* 링크 간 여백 증가 */
  align-items: center;

  @media (max-width: 768px) {
    gap: 12px; /* 모바일 화면에서 여백 조정 */
  }
`;

const NavItem = styled.h4`
  font-family: "Spoqa Han Sans Neo", sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: white;
  margin: 0;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #ffe0e0;
  }

  @media (max-width: 768px) {
    font-size: 14px; /* 작은 화면에서 글자 크기 축소 */
  }
`;
