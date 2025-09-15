import React from 'react';

interface ControlButtonProps {
  onClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
  'aria-label': string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ 
    onClick, 
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    children, 
    disabled = false, 
    'aria-label': ariaLabel 
}) => {
  const baseClasses = "rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg transform transition-all duration-200 ease-in-out select-none"; // Added select-none
  const enabledClasses = "bg-gradient-to-br from-green-400 to-blue-500 text-white hover:scale-110 hover:shadow-xl active:scale-95";
  const disabledClasses = "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70";

  return (
    <button
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${baseClasses} ${disabled ? disabledClasses : enabledClasses}`}
    >
      {children}
    </button>
  );
};

export default ControlButton;