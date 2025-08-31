import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./lib/db.js";
import session from "express-session";
import qs from "qs";     
import loginRoutes from "./routes/login.route.js";
import questionRoutes from "./routes/question.route.js";
import authRouters from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());

//로그인 세션을 위한 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
      cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 //24시간동안 유지
      },
  })
);
//cors 프백 연결
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

//swagger
const options = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "이화이언 여름 토이프로젝트: 질문게시판",
      version: "1.0.0",
      description: "이 문서는 여름토이플젝: 질문게시판 api 문서입니다.",
    },
    servers: [
      { url: "http://localhost:5000" } 
    ],
  },
  apis: ["./controllers/*.js"],
};


const specs = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/login", loginRoutes);
app.use("/api/auth", authRouters);
app.use("/api/questions", questionRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  connectDB();
});