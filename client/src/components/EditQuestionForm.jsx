import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditQuestionForm = ({ isOpen, onClose, onSubmit, question }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 질문 데이터로 폼 초기화
  useEffect(() => {
    if (isOpen && question) {
      setFormData({
        title: question.title || '',
        subtitle: question.subtitle || '',
        content: question.content || ''
      });
      setIsSubmitting(false);
    }
  }, [isOpen, question]);

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // 시뮬레이션된 로딩
    setTimeout(() => {
      onSubmit({
        ...question,
        ...formData
      });
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.title.trim() && formData.content.trim();

  if (!isOpen || !question) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fadeIn">
      <div className="
        bg-white rounded-xl shadow-xl 
        w-2/3 max-w-2xl
        transform transition-all duration-300
        animate-slideIn
      ">
        {/* 헤더 */}
        <header className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-1xl font-bold text-gray-800">질문 수정하기</h2>
            <p className="text-sm text-gray-500 mt-1">질문 내용을 수정해보세요</p>
          </div>
          <button 
            onClick={onClose}
            className="
              p-2 text-gray-400 hover:text-gray-600 
              rounded-full hover:bg-gray-100
              transition-all duration-200
            "
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </header>

        {/* 폼 콘텐츠 */}
        <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* 제목 필드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              질문 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="
                w-full px-4 py-3 
                border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-1 focus:ring-black-100 focus:border-transparent
                transition-all duration-200
                placeholder-gray-400
              "
              placeholder="질문을 적어주세요!"
              disabled={isSubmitting}
            />
          </div>

           

          {/* 내용 필드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              질문 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={5}
              className="
                w-full px-4 py-3 
                border border-gray-200 rounded-xl 
                focus:outline-none focus:ring-1 focus:ring-black-100 focus:border-transparent
                transition-all duration-200
                placeholder-gray-400
                resize-none
              "
              placeholder="질문 내용을 자세히 설명해 주세요."
              disabled={isSubmitting}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.content.length}/500
            </div>
          </div>
        </form>

        {/* 푸터 */}
        <footer className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="
              px-6 py-3 
              text-gray-600 font-medium
              bg-white border border-gray-300
              hover:bg-gray-50
              rounded-xl transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="
              flex-1 px-6 py-3 
              text-white font-medium
              bg-gradient-to-r from-green-600 to-green-700
              hover:cursor-pointer
              rounded-xl transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center
            "
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                수정 중...
              </>
            ) : (
              '수정 완료'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EditQuestionForm;