// routes/auth.js
import express from "express";
import User from "../models/user.model.js";

const authRouters = express.Router();

authRouters.get("/me", async (req, res) => {
  try {
    const id = req.session?.userId;
    if (!id) return res.status(200).json({ user: null }); // 로그인 안 됨

    const user = await User.findById(id).select("_id username email"); // 필요한 필드만
    if (!user) return res.status(200).json({ user: null });            // 세션에 오래된 ID가 남은 경우

    return res.status(200).json({ user });
  }
  catch (err) {
    console.error("/auth/me error:", err);
    return res.status(500).json({ message: "서버 오류" });
  }
});

export default authRouters;
