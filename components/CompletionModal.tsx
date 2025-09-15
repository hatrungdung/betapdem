import React from 'react';
import Fireworks from './Fireworks';

interface CompletionModalProps {
  winner: string;
  time: number;
  onPlayAgain: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ winner, time, onPlayAgain }) => {

  const getRank = (seconds: number) => {
    if (seconds < 15) return { text: "Siêu Tốc!", color: "text-red-500" };
    if (seconds < 30) return { text: "Rất Nhanh!", color: "text-orange-500" };
    if (seconds < 60) return { text: "Giỏi Lắm!", color: "text-yellow-500" };
    return { text: "Cố gắng nhé!", color: "text-green-500" };
  }
  
  const rank = getRank(time);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 animate-fade-in">
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            
            @keyframes scale-up {
                from { transform: scale(0.7); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-up { animation: scale-up 0.4s ease-out 0.2s forwards; }
        `}</style>
      <Fireworks />
      <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center w-11/12 max-w-md transform-gpu animate-scale-up opacity-0">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-800 drop-shadow-lg mb-2">
          {winner} Thắng!
        </h2>
        <p className="text-gray-700 text-lg mb-4">Bé đã hoàn thành rồi!</p>
        
        <div className="bg-blue-100 rounded-xl p-4 my-6">
            <p className="text-xl text-blue-900">
                Thời gian: <span className="font-bold text-2xl">{time.toFixed(2)}</span> giây
            </p>
            <p className={`text-xl mt-2 ${rank.color}`}>
                Xếp hạng: <span className="font-bold text-2xl">{rank.text}</span>
            </p>
        </div>
        
        <button
          onClick={onPlayAgain}
          className="w-full px-6 py-4 bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold text-xl rounded-2xl shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          Chơi Lại
        </button>
      </div>
    </div>
  );
};

export default CompletionModal;
