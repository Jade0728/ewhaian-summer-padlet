// /client/src/hook/useQuestions.js (예시)
import { useEffect, useState } from "react";
import {
  getQuestions,
  createQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
  toggleLikeAPI,
} from "../api/question.js";

export default function useQuestions() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getQuestions();
      setQuestions(data);
    })();
  }, []);

  const addQuestion = async ({ title, content }) => {
    const created = await createQuestionAPI({ title, content });
    setQuestions(prev => [created, ...prev]);
  };

  const editQuestion = async ({ id, title, content }) => {
    const updated = await updateQuestionAPI({ id, title, content });
    setQuestions(prev => prev.map(q => (q.id === id ? updated : q)));
  };

  const deleteQuestion = async (id) => {
    await deleteQuestionAPI(id);
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const likeQuestion = async (id) => {
    const updated = await toggleLikeAPI(id);
    setQuestions(prev => prev.map(q => (q.id === id ? updated : q)));
  };

  return { questions, addQuestion, editQuestion, deleteQuestion, likeQuestion };
}
