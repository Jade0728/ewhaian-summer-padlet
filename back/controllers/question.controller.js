//질문 create, delete, update, read
import mongoose from "mongoose";
import Question from "../models/question.model.js";
import User from "../models/user.model.js";

//create: 질문 저장
export const createQuestion = async (req, res) => {
    try {
        const authorId = req.userId;
        if (!authorId) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "title과 content는 필수입니다." });
        }

        const doc = await Question.create({
            title: title.trim(),
            content: content.trim(),
            author:authorId
        });

        const populated = await doc.populate("author", "username email");
        return res.status(201).json(populated);
    
    } catch (err) {
        console.log("createQuestion error", err);
        return res.status(500).json({ message: "서버 오류" });
    }
}

const assertOwner = (doc, sessionUserId) => {
  if (!doc?.author || !sessionUserId) return false;

  // 1) author가 populate 안 된 경우: author === ObjectId
  // 2) author가 populate 된 경우: author._id === ObjectId
  const authorId = doc.author._id ?? doc.author;

  // ObjectId 타입이면 equals로 비교 (문자열/ObjectId 모두 비교 가능)
  if (authorId?.equals) return authorId.equals(sessionUserId);

  // 혹시 문자열로 들어온 케이스(드묾)를 대비한 안전장치
  return String(authorId) === String(sessionUserId);
};

//delete: 질문 삭제
export const deleteQuestion = async (req, res) => {
  try {
    const q = await Question.findById(req.params.id).select("_id author");
    if (!q) return res.status(404).json({ message: "존재하지 않는 질문입니다." });

    if (!assertOwner(q, req.userId)) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    await q.deleteOne();
    return res.status(200).json({ message: "삭제 완료" });
  }
  catch (err) {
    console.error("deleteQuestion error:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
};

//update: 질문 수정 후 저장
export const updateQuestion = async (req, res) => {
    try {
        const { title, content } = req.body;

        const q = await Question.findById(req.params.id).select("_id author");
        if (!q) return res.status(404).json({ message: "존재하지 않는 질문입니다." });

        if (!assertOwner(q,req.userId)) {
        return res.status(403).json({ message: "수정 권한이 없습니다." });
        }
        
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            { ...(title && { title }), ...(content && { content }) },
            { new: true }
        ).populate("author", "username email");
        
        return res.status(200).json(updated);
    }
    catch (err) {
        console.log("updateQuestion error:", err);
        return res.status(500).json({ message: "서버 오류" });
    }
}

//read: db에 있는 질문들을 꺼내와서 프론트에 보내주기
export const readQuestion = async (req, res) => {
    try {
        const userId = req.userId ? String(req.userId) : null;

        const docs = await Question.find({})
        .sort({ _id: -1 })
        .populate("author", "username email")
        .lean(); // virtuals 필요 없어요. 직접 계산할게요.

        const questions = docs.map((q) => {
            const likes = Array.isArray(q.likedBy) ? q.likedBy.length : 0;

            //내가 로그인했다면(userId가 있다면), 이 질문의 likedBy 배열에 내 id가 들어 있는지를 검사
            // 있으면 true → 프론트에서 하트 채우기(그리고 토글 시 UI 반영).
            // 로그인 안 했으면 무조건 false.
            const liked = userId
                ? q.likedBy?.some((id) => String(id) === userId)
                : false;
            const { _id, ...rest } = q;
            return { id: String(_id), ...rest, likes, liked };
        });

        return res.status(200).json(questions);
    } catch (err) {
            console.error("readQuestion error", err);
            return res.status(500).json({ message: "서버 오류" });
    }
};

//좋아요 기능
//내가 이 질문에 좋아요를 눌렀는지 확인 → 누른 상태면 취소, 
// 아니면 추가 → 저장 → 프론트가 바로 쓸 수 있게 likes(숫자) 와 liked(불리언)까지 붙여서 돌려줌
export const toggleLike = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(400).json({ message: "userId가 필요합니다." });

        const q = await Question.findById(req.params.id);
        if (!q) return res.status(404).json({ message: "존재하지 않는 질문입니다." });

        //내가 이 질문에 좋아요를 눌렀는지 확인
        const oid = new mongoose.Types.ObjectId(userId);
        const already = q.likedBy.some((id) => id.equals(oid));

        if (already) q.likedBy.pull(oid); //이미 눌렀으면 pull로 제거(좋아요 취소).
        else q.likedBy.addToSet(oid); //안 눌렀으면 addToSet으로 추가(좋아요).

        await q.save();
        await q.populate("author", "username email");

        const obj = q.toObject(); // 문서 -> 평범한 객체
        const likes = obj.likedBy?.length ?? 0;
        const liked = !already;

        // _id -> id 매핑
        const { _id, __v, ...rest } = obj;
        return res.status(200).json({ id: String(_id), ...rest, likes, liked });
    } catch (err) {
        console.error("toggleLike error:", err);
        return res.status(500).json({ message: "서버 오류" });
  }
};