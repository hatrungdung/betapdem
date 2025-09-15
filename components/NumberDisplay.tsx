import React from 'react';

interface NumberDisplayProps {
  count: number;
  animate: 'up' | 'down' | '';
  maxCount: number;
  fontClass: string;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ count, animate, maxCount, fontClass }) => {
  const getFormattedCount = () => {
    if (maxCount === 100) {
      // "Trăm": pad to 3 digits. e.g., 005, 075, 100
      return String(count).padStart(3, '0');
    }

    if (maxCount === 1000) {
      // "Ngàn": pad to 4 digits and format as X.XXX. e.g., 0.005, 0.123, 1.000
      const padded = String(count).padStart(4, '0');
      return `${padded.slice(0, 1)}.${padded.slice(1)}`;
    }

    if (maxCount === 1000000) {
      // "Triệu": pad to 7 digits and format as X.XXX.XXX. e.g., 0.012.345, 1.000.000
      const padded = String(count).padStart(7, '0');
      return `${padded.slice(0, 1)}.${padded.slice(1, 4)}.${padded.slice(4)}`;
    }
    
    if (maxCount === 1000000000) {
      // "Tỷ": pad to 10 digits and format as X.XXX.XXX.XXX. e.g., 0.012.345.678, 1.000.000.000
      const padded = String(count).padStart(10, '0');
      return `${padded.slice(0, 1)}.${padded.slice(1, 4)}.${padded.slice(4, 7)}.${padded.slice(7)}`;
    }
    
    // Fallback to standard formatting for any other case
    return count.toLocaleString('vi-VN');
  };

  const formattedCount = getFormattedCount();
  
  const animationClass = 
    animate === 'up' ? 'animate-bounce-up' :
    animate === 'down' ? 'animate-bounce-down' : '';

  // Adjust font size based on length and font family to prevent overflow
  const getFontSize = (text: string, font: string) => {
    // Special adjustment for the very wide "Luckiest Guy" font
    if (font === 'font-luckiest-guy') {
      if (text.length > 13) return 'text-3xl md:text-4xl lg:text-5xl'; // Tỷ
      if (text.length > 9) return 'text-4xl md:text-5xl lg:text-6xl'; // Triệu
      return 'text-5xl md:text-7xl lg:text-8xl';
    }

    // Default sizing for other fonts
    if (text.length > 13) return 'text-4xl md:text-5xl lg:text-6xl';
    if (text.length > 9) return 'text-5xl md:text-6xl lg:text-7xl';
    return 'text-5xl md:text-7xl lg:text-8xl';
  }

  const fontSizeClass = getFontSize(formattedCount, fontClass);

  return (
    <div className="w-64 md:w-96 h-32 md:h-48 bg-white rounded-3xl shadow-inner flex items-center justify-center overflow-hidden px-2">
        <style>{`
            @keyframes bounce-up {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
            }
            .animate-bounce-up { animation: bounce-up 0.3s ease-out; }
            
            @keyframes bounce-down {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(15px); }
            }
            .animate-bounce-down { animation: bounce-down 0.3s ease-out; }
        `}</style>
      <span className={`font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${animationClass} ${fontSizeClass} ${fontClass}`}>
        {formattedCount}
      </span>
    </div>
  );
};

export default NumberDisplay;