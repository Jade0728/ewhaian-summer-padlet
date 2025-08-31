import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
})

// 좋아요 수를 가져오는 필드
questionSchema.virtual('likesCount').get(function() {
    return this.likedBy.length;
});

// JSON 응답에서 _id -> id
questionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});
const Question = mongoose.model("Question", questionSchema);
export default Question;