import React from 'react';

const PageHeader = ({ title, subtitle}) => {
  return (
    <header className="text-center md:text-left mb-8 md:mb-12">
      <div className="max-w-4xl mx-auto md:mx-0">
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
          {title}
        </h1>
        <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0">
          {subtitle}
        </p>
        
        {/* 장식적 요소 - 데스크탑에서는 왼쪽 정렬 */}
        <div className="flex justify-center md:justify-start mt-3 md:mt-5 space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;