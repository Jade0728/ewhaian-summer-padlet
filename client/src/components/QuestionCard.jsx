import React, { useState, useRef, useEffect } from 'react';
import { Heart, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

const QuestionCard = ({ question, onLike, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = () => { setShowMenu(false); onEdit(question); };
  const handleDelete = () => {
    setShowMenu(false);
    if (window.confirm('정말로 이 질문을 삭제하시겠습니까?')) onDelete(question.id);
  };

  return (
    <div
      className="
        w-full min-h-0                         
        bg-gradient-to-br bg-white/70
        rounded-lg p-2 shadow-lg hover:shadow-xl
        transition-all duration-300 transform hover:-translate-y-1
        relative group
      "
      style={{ height: 'fit-content' }} // 글자 수에 맞게 크기 조절
    >
      {/* 상단: 제목 + 메뉴 */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg mb-1 leading-snug break-words">
          {question.title}
        </h3>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="text-black/70 hover:black-white rounded-full hover:bg-black/10 transition-all duration-200"
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white/70 rounded-lg shadow-lg py-2 min-w-[140px] z-10">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left transition-colors flex items-center gap-2 text-gray-700 hover:cursor-pointer"
              >
                <Edit2 size={16} />
                <span>수정하기</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left transition-colors flex items-center gap-2 text-red-600 hover:cursor-pointer"
              >
                <Trash2 size={16} />
                <span>삭제하기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 내용: 줄수 제한 제거 + 긴 단어 강제 줄바꿈 */}
      <div className="text-black mb-2">
        <p className="text-black/80 text-sm leading-relaxed break-words whitespace-pre-wrap">
          {question.content}
        </p>
        {/* 
          - break-words: 매우 긴 단어/연속문자(aaaa...)도 줄바꿈
          - 필요하면 break-all 로 더 강하게 강제 줄바꿈 가능
          - whitespace-pre-wrap: 개행 문자 유지 + 자동 줄바꿈
        */}
      </div>

      {/* 좋아요 */}
      <button
        onClick={() => onLike(question.id)}
        className="flex items-center gap-2 text-black hover:text-green-500 transition-all duration-200 group/like"
      >
        <Heart
          size={20}
          className={`transition-all duration-200 ${
            question.liked ? 'fill-green-800 text-green-800' : 'hover:fill-green-500'
          } group-hover/like:scale-105`}
        />
        <span className="font-medium">{question.likes || 0}</span>
      </button>
    </div>
  );
};

export default QuestionCard;
