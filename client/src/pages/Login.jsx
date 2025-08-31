import React from "react"
import kakaoLogin from '../assets/kakaoLogin.png'
import ewhaianLogo from '../assets/ewhaianLogo.png'
import '../App.css'
import { axiosInstance } from '../lib/axios.js';

const Login = () => {

  const loginHandler = async () => {
    const res = await axiosInstance.get("/login/authorize");
    window.location.href = res.data.kakaoAuthUrl;
  };

  return (
    <div className="center-container">
      {/* 로고 + 제목 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src={ewhaianLogo}
          alt="이화이언 로고"
          style={{ width: '64px', height: '64px', objectFit: 'contain' }}
        />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          환영합니다! ewhaian-summer-padlet
        </h1>
      </div>

      {/* 카카오 로그인 버튼 */}
      <button onClick={loginHandler}>
        <img 
          src={kakaoLogin}
          alt="카카오톡으로 3초만에 시작하기"
          style={{ width: '14rem', objectFit: 'contain' }}
        />
      </button>
    </div>
  )
}

export default Login
