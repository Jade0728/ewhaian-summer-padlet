import express from "express";
import { createQuestion, deleteQuestion, updateQuestion, readQuestion,toggleLike } from "../controllers/question.controller.js";
import { checkAuthentication } from "../middleware/checkAuthentication.js";

const questionRoutes = express.Router();

questionRoutes.post("/", checkAuthentication,createQuestion);          // 새 질문
questionRoutes.get("/",checkAuthentication,readQuestion)               // 질문 전체 목록 조회 
questionRoutes.patch("/:id", checkAuthentication,updateQuestion);      // 수정
questionRoutes.delete("/:id", checkAuthentication,deleteQuestion);     // 삭제
questionRoutes.post("/:id/like", checkAuthentication,toggleLike);      // 좋아요 토글

export default questionRoutes;