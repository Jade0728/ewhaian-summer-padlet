import { useState } from 'react';

const useQuestions = () => {
  const [questions, setQuestions] = useState([  ]);

  // 질문 추가
  const addQuestion = (questionData) => {
    const newQuestion = {
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
      ...questionData,
      likes: 0,
      liked: false,
      createdAt: new Date().toISOString()
    };
    
    setQuestions(prev => [newQuestion, ...prev]);
  };

  // 질문 수정
  const editQuestion = (updatedQuestion) => {
    setQuestions(prev => 
      prev.map(question => 
        question.id === updatedQuestion.id 
          ? { ...question, ...updatedQuestion, updatedAt: new Date().toISOString() }
          : question
      )
    );
  };

  // 질문 삭제
  const deleteQuestion = (questionId) => {
    setQuestions(prev => prev.filter(question => question.id !== questionId));
  };

  // 좋아요 토글
  const likeQuestion = (questionId) => {
    setQuestions(prev =>
      prev.map(question =>
        question.id === questionId
          ? {
              ...question,
              liked: !question.liked,
              likes: question.liked ? question.likes - 1 : question.likes + 1
            }
          : question
      )
    );
  };

  // 특정 질문 찾기
  const findQuestion = (questionId) => {
    return questions.find(question => question.id === questionId);
  };

  return {
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    findQuestion
  };
};

export default useQuestions;