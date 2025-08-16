import React, { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import AddQuestionForm from '../components/AddQuestionForm.jsx';
import EditQuestionForm from '../components/EditQuestionForm.jsx';
import useQuestions from '../hook/useQuestions.js';

const Home = () => {
  const { questions, addQuestion, editQuestion, deleteQuestion, likeQuestion } = useQuestions();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // 질문 추가 핸들러
  const handleAddQuestion = (questionData) => {
    addQuestion(questionData);
    setShowAddForm(false);
  };

  // 질문 수정 핸들러
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowEditForm(true);
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    editQuestion(updatedQuestion);
    setShowEditForm(false);
    setEditingQuestion(null);
  };

  // 질문 삭제 핸들러
  const handleDeleteQuestion = (questionId) => {
    deleteQuestion(questionId);
  };

  // 폼 열기/닫기 핸들러
  const handleOpenAddForm = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setEditingQuestion(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900">
      {/* 메인 컨테이너 - 반응형 패딩과 여백 */}
      <div className="max-w-7xl mx-2 px-4 sm:px-6 lg:px-8">
        {/* 헤더 섹션 - 반응형 여백 및 정렬 */}
        <div className="pt-4 sm:pt-6 lg:pt-8 text-center md:text-left">
          <PageHeader 
            title="질문 보드" 
            subtitle="궁금한 것들을 자유롭게 올려보세요!" 
          />
        </div>
        
        {/* 질문 그리드 섹션 - 반응형 여백 */}
        <section className="mb-8 sm:mb-12 lg:mb-16"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onLike={likeQuestion}
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              ))}
            </div>
  
        </section>

        {/* 데스크탑용 질문 추가 버튼 - 우하단 고정 */}
        <button
          onClick={handleOpenAddForm}
          className="hidden md:flex fixed bottom-8 right-8 lg:bottom-12 lg:right-12 
          w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg 
          hover:shadow-xl transition-all duration-300 items-center justify-center text-white 
          hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500 z-40"
        >
          <svg 
            className="w-8 h-8 lg:w-10 lg:h-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* 질문 추가 폼 모달 */}
      <AddQuestionForm
        isOpen={showAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleAddQuestion}
      />

      {/* 질문 수정 폼 모달 */}
      <EditQuestionForm
        isOpen={showEditForm}
        onClose={handleCloseEditForm}
        onSubmit={handleUpdateQuestion}
        question={editingQuestion}
      />

      {/* 플로팅 액션 버튼 (모바일/태블릿용만) */}
      <button
        onClick={handleOpenAddForm}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110 focus:outline-none focus:ring-4 focus:ring-pink-300 z-40"
      >
        <svg 
          className="w-6 h-6 sm:w-7 sm:h-7" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Home;