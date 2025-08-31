import express from "express";
import { getAuthorizationCode, kakaoLogin,logout,isLogin } from "../controllers/login.controller.js";
import { checkAuthentication } from "../middleware/checkAuthentication.js";

const loginRoutes = express.Router();

loginRoutes.get("/authorize", getAuthorizationCode);
loginRoutes.get("/kakao-login", kakaoLogin);

// login 안 한 사용자가 접근할 경우 401 error
loginRoutes.post("/logout", checkAuthentication, logout);
loginRoutes.get("/check-auth", checkAuthentication, isLogin);

export default loginRoutes;