
import React from 'react';
import QuestionCard from './QuestionCard.jsx';

const QuestionGrid = ({ questions, onLike }) => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* CSS Grid를 이용한 자동 크기 조절 레이아웃 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        {questions.map((q) => (
          <div
            key={q.id}
            className="w-full"  // 각 카드가 자신의 콘텐츠 크기에 맞게 조절
          >
            <QuestionCard question={q} onLike={onLike} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionGrid;