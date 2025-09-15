import React from 'react';
import ControlButton from './ControlButton';
import NumberDisplay from './NumberDisplay';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';

interface PlayerState {
  count: number;
  animate: 'up' | 'down' | '';
}

interface PlayerHandlers {
    startIncrementing: () => void;
    startDecrementing: () => void;
    handleClickIncrement: () => void;
    handleClickDecrement: () => void;
    stopCounting: () => void;
}

interface PlayerUIProps {
    playerName: string;
    playerState: PlayerState;
    handlers: PlayerHandlers;
    maxCount: number;
    fontClass: string;
    isFlipped: boolean;
    isDisabled: boolean;
    colorScheme: 'blue' | 'orange';
}

const colorSchemes = {
    blue: {
        bg: 'bg-gradient-to-br from-blue-200 to-cyan-200',
        header: 'text-blue-800',
    },
    orange: {
        bg: 'bg-gradient-to-br from-orange-200 to-red-200',
        header: 'text-orange-800',
    }
}

const PlayerUI: React.FC<PlayerUIProps> = ({
    playerName,
    playerState,
    handlers,
    maxCount,
    fontClass,
    isFlipped,
    isDisabled,
    colorScheme,
}) => {
    const { count, animate } = playerState;
    const { 
        startIncrementing,
        startDecrementing,
        handleClickIncrement,
        handleClickDecrement,
        stopCounting,
    } = handlers;
    
    const colors = colorSchemes[colorScheme];
    const rotationClass = isFlipped ? 'rotate-180' : '';

    return (
        <div className={`flex-1 w-full flex flex-col items-center justify-center p-4 relative ${colors.bg}`}>
            <div className={`absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20`}></div>
            <div className={`relative z-10 w-full max-w-4xl flex flex-col items-center ${rotationClass}`}>
                 <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg ${colors.header}`}>
                    {playerName}
                </h1>
                <div className="flex items-center justify-center w-full gap-4 md:gap-8">
                    <ControlButton 
                        onClick={handleClickDecrement}
                        onMouseDown={startDecrementing}
                        onMouseUp={stopCounting}
                        onMouseLeave={stopCounting}
                        onTouchStart={startDecrementing}
                        onTouchEnd={stopCounting}
                        disabled={count === 0 || isDisabled} 
                        aria-label="Trừ"
                    >
                        <MinusIcon />
                    </ControlButton>
                    
                    <NumberDisplay count={count} animate={animate} maxCount={maxCount} fontClass={fontClass} />
                    
                    <ControlButton 
                        onClick={handleClickIncrement}
                        onMouseDown={startIncrementing}
                        onMouseUp={stopCounting}
                        onMouseLeave={stopCounting}
                        onTouchStart={startIncrementing}
                        onTouchEnd={stopCounting}
                        disabled={count === maxCount || isDisabled} 
                        aria-label="Cộng"
                    >
                        <PlusIcon />
                    </ControlButton>
                </div>
            </div>
        </div>
    );
};

export default PlayerUI;