import React, { useState } from 'react';
import PageHeader from './PageHeader.jsx';
import QuestionGrid from './QuestionGrid.jsx';
import AddQuestionForm from './AddQuestionForm.jsx';
import useQuestions from '../hook/useQuestions.js';

const QuestionPadlet = () => {
  const { questions, addQuestion, likeQuestion } = useQuestions();
  const [showForm, setShowForm] = useState(false);

  const handleAddQuestion = (questionData) => {
    addQuestion(questionData);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-orange-400 p-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader />
        
        <QuestionGrid 
          questions={questions}
          onLike={likeQuestion}
          onAddClick={() => setShowForm(true)}
        />

        <AddQuestionForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleAddQuestion}
        />
      </div>
    </div>
  );
};

export default QuestionPadlet;