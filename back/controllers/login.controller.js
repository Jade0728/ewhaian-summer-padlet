import dotenv from "dotenv";
import axios from "axios";
import User from "./../models/user.model.js";

dotenv.config();

export const getAuthorizationCode = async (req, res) => {
    const CLIENT_ID = process.env.KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
    const kakaoAuthUrl = 
        "https://kauth.kakao.com/oauth/authorize"
        + `?response_type=code`
        + `&client_id=${process.env.KAKAO_REST_API_KEY}`
        + `&redirect_uri=${encodeURIComponent(process.env.KAKAO_REDIRECT_URI)}`
        + `&scope=${encodeURIComponent("account_email,profile_nickname")}`
    
    return res.status(200).json({ kakaoAuthUrl });
}

//카카오 로그인: access token 받아오기
const requestAccessToken = async (code) => {
    const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
    const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET; // 콘솔에서 사용중이면 필수

    try {
        const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_REST_API_KEY,
        redirect_uri: REDIRECT_URI, // 콘솔 등록 값과 100% 동일해야 함
        code,                       // 1회용. 재사용하면 400
        ...(KAKAO_CLIENT_SECRET ? { client_secret: KAKAO_CLIENT_SECRET } : {}),
        });

        const { data } = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        body,
        { headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" } }
        );

        const { access_token: accessToken } = data;
        if (!accessToken) throw new Error(`no access_token in response: ${JSON.stringify(data)}`);

        return accessToken;

    } catch (error) {
        console.error(
        "카카오 access token 발급 실패:",
        error.response?.status,
        error.response?.data || error.message
        );
        throw new Error(
        `카카오에서 access token 발급 실패: ${JSON.stringify(error.response?.data || error.message)}`
    );
  }
};

//access token을 통해 회원정보(username, email) 받기
const getUserInfo = async (accessToken) => {
    try {
        console.log("access token: ", accessToken);

        // data만 구조 분해
        const { data } = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`, // GET에 Content-Type 불필요
            // Accept: "application/json", // 선택
        },
        });

        // 안전 파싱(옵셔널 체이닝 + 기본값)
        const account = data?.kakao_account ?? {};
        const profile = account?.profile ?? {};

        // 동의 필요 여부(참고용)
        const needsEmail = account?.email_needs_agreement === true;
        const needsProfile = account?.profile_nickname_needs_agreement === true;

        const username = profile?.nickname ?? `kakao_${data?.id ?? "user"}`;
        const email = account?.email ?? null;

        console.log("사용자의 username:", username);
        console.log("사용자의 email:", email);

        return { username, email, needsEmail, needsProfile };
    } catch (error) {
        // 에러 디테일 로깅
        console.error(
        "getUserInfo failed:",
        error.response?.status,
        error.response?.data || error.message
        );
        // 헬퍼에서는 res 쓰지 말고 throw
        throw new Error("getUserInfo failed");
  }
};

//카카오 로그인
export const kakaoLogin = async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ message: "Authorization code 인가코드가 없습니다."});
    }
    try {
        //인가코드로 access token 가져오기
        const accessToken = await requestAccessToken(code);

        //access token으로 username, email 받아오기
        const { username, email } = await getUserInfo(accessToken);

        //db에 해당 user 있는지 확인하기
        const user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ username, email }); // timestamps 쓰면 createdAt 안 넣어도 됨
        }

        // 세션 키는 한 가지로 통일
        req.session.userId = user._id.toString();
        req.session.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
        };

    // 세션 저장 후 프론트로 리디렉트 (두 분기 동일)
    req.session.save(() => {
      return res.redirect(process.env.FRONTEND_URL); // 예: http://localhost:5173
    });
    } catch (error) {
        console.log("로그인 실패! ", error);
        return res.status(500).json({ message: "서버 오류 발생" });
    }
}

//로그아웃
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("로그아웃 실패!", err);
            return res.status(500).json({ message: "로그아웃 실패!" })
        }
        res.clearCookie("connect.sid"); // 선택사항: 세션 쿠키 삭제
        return res.status(200).json({ message: "로그아웃 성공!" })

    })
}

//실제 로그인 검증은 checkAuthentication에서 이미 끝났고, 이 함수는 그 결과를 응답으로 알려주는 역할.
export const isLogin = async (req, res)=>{
    const userId = req.userId;
    return res.status(200).json({message : "로그인 확인 완료"});
}