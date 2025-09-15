import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LIMIT_OPTIONS, STEP_OPTIONS, FONT_OPTIONS } from './constants';
import SettingsPanel from './components/SettingsPanel';
import { playSound } from './utils/audio';
import CompletionModal from './components/CompletionModal';
import TomAndJerry from './components/TomAndJerry';
import PlayerUI from './components/PlayerUI';

type Player = 'p1' | 'p2';

interface PlayerState {
  count: number;
  animate: 'up' | 'down' | '';
  startTime: number | null;
}

const initialPlayerState: PlayerState = {
  count: 0,
  animate: '',
  startTime: null,
};

function App() {
  // Shared Settings
  const [maxCount, setMaxCount] = useState<number>(LIMIT_OPTIONS[0].value);
  const [step, setStep] = useState<number>(STEP_OPTIONS[0].value);
  const [fontClass, setFontClass] = useState<string>(FONT_OPTIONS[0].value);
  const [player1Name, setPlayer1Name] = useState<string>('Bé 1');
  const [player2Name, setPlayer2Name] = useState<string>('Bé 2');


  // Player States
  const [p1State, setP1State] = useState<PlayerState>(initialPlayerState);
  const [p2State, setP2State] = useState<PlayerState>(initialPlayerState);

  // Game State
  const [winner, setWinner] = useState<Player | null>(null);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [animationTrigger, setAnimationTrigger] = useState<{ key: number; number: number } | null>(null);

  const intervalRefs = useRef<{ [key in Player]?: ReturnType<typeof setInterval> | null }>({});
  const timeoutRefs = useRef<{ [key in Player]?: ReturnType<typeof setTimeout> | null }>({});

  const resetGame = useCallback(() => {
    setP1State(initialPlayerState);
    setP2State(initialPlayerState);
    setWinner(null);
    setCompletionTime(0);
    setAnimationTrigger(null);
  }, []);

  useEffect(() => {
    resetGame();
  }, [maxCount, step, resetGame]);
  
  const stopCounting = useCallback((player: Player) => {
    if (timeoutRefs.current[player]) clearTimeout(timeoutRefs.current[player]!);
    if (intervalRefs.current[player]) clearInterval(intervalRefs.current[player]!);
    timeoutRefs.current[player] = null;
    intervalRefs.current[player] = null;
  }, []);
  
  const stopAllCounting = useCallback(() => {
      stopCounting('p1');
      stopCounting('p2');
  }, [stopCounting]);

  const handleAnimation = useCallback((player: Player, direction: 'up' | 'down') => {
    const setState = player === 'p1' ? setP1State : setP2State;
    setState(s => ({ ...s, animate: direction }));
    setTimeout(() => setState(s => ({ ...s, animate: '' })), 300);
  }, []);

  const performIncrement = useCallback((player: Player) => {
    if (winner) return;

    const setState = player === 'p1' ? setP1State : setP2State;
    
    setState(s => {
      const currentTime = Date.now();
      let currentStartTime = s.startTime;
      if (!currentStartTime) {
          currentStartTime = currentTime;
      }
      
      const nextCount = Math.min(maxCount, s.count + step);
      
      const prevMilestones = Math.floor((s.count * 10) / maxCount);
      const newMilestones = Math.floor((nextCount * 10) / maxCount);

      if (newMilestones > prevMilestones && newMilestones <= 10) {
          setAnimationTrigger({ key: Date.now(), number: newMilestones });
      }

      if (nextCount >= maxCount && !winner) {
          stopAllCounting();
          const finalTime = (currentTime - (currentStartTime || currentTime)) / 1000;
          setCompletionTime(finalTime);
          setWinner(player);
          playSound('increment');
          return { ...s, count: maxCount, startTime: currentStartTime };
      }
      return { ...s, count: nextCount, startTime: currentStartTime };
    });
  }, [maxCount, step, stopAllCounting, winner]);

  const performDecrement = useCallback((player: Player) => {
    if (winner) return;
    const setState = player === 'p1' ? setP1State : setP2State;

    setState(s => {
        const prevCount = s.count - step;
        if (prevCount <= 0) {
            stopCounting(player);
            return { ...s, count: 0 };
        }
        return { ...s, count: prevCount };
    });
  }, [step, stopCounting, winner]);
  
  const createHandlers = (player: Player) => {
    const playerState = player === 'p1' ? p1State : p2State;
    
    const startIncrementing = () => {
        stopCounting(player);
        if (playerState.count >= maxCount || winner) {
            playSound('limit');
            return;
        }
        playSound('increment');
        handleAnimation(player, 'up');
        performIncrement(player);

        timeoutRefs.current[player] = setTimeout(() => {
            intervalRefs.current[player] = setInterval(() => performIncrement(player), 100);
        }, 400);
    };

    const startDecrementing = () => {
        stopCounting(player);
        if (playerState.count <= 0 || winner) {
            playSound('limit');
            return;
        }
        playSound('decrement');
        handleAnimation(player, 'down');
        performDecrement(player);

        timeoutRefs.current[player] = setTimeout(() => {
            intervalRefs.current[player] = setInterval(() => performDecrement(player), 100);
        }, 400);
    };

    const handleClickIncrement = () => {
        if (playerState.count < maxCount && !winner) {
            playSound('increment');
            handleAnimation(player, 'up');
            performIncrement(player);
        } else {
            playSound('limit');
        }
    };

    const handleClickDecrement = () => {
        if (playerState.count > 0 && !winner) {
            playSound('decrement');
            handleAnimation(player, 'down');
            performDecrement(player);
        } else {
            playSound('limit');
        }
    };
    
    return {
        startIncrementing,
        startDecrementing,
        handleClickIncrement,
        handleClickDecrement,
        stopCounting: () => stopCounting(player),
    }
  }
  
  const p1Handlers = createHandlers('p1');
  const p2Handlers = createHandlers('p2');

  return (
    <div className="min-h-screen bg-gray-100 text-center flex flex-col items-center justify-center overflow-hidden relative">
        <TomAndJerry trigger={animationTrigger} />
        {winner && (
            <CompletionModal 
                winner={winner === 'p1' ? player1Name : player2Name}
                time={completionTime}
                onPlayAgain={resetGame}
            />
        )}
      
        {/* Player 1 Area */}
        <PlayerUI 
            playerName={player1Name}
            playerState={p1State}
            handlers={p1Handlers}
            maxCount={maxCount}
            fontClass={fontClass}
            isFlipped={false}
            isDisabled={!!winner}
            colorScheme="blue"
        />

        {/* Shared Settings Area */}
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-4 py-4 bg-white/50 backdrop-blur-sm shadow-xl">
            <div className="w-full flex justify-around items-center px-4 mb-2">
                <div className="flex-1 flex flex-col items-center">
                    <label htmlFor="p1-name" className="text-lg font-semibold text-blue-800">Tên Bé 1</label>
                    <input 
                        type="text" 
                        id="p1-name"
                        value={player1Name}
                        onChange={(e) => setPlayer1Name(e.target.value)}
                        className="w-full max-w-xs p-2 text-center bg-blue-100 border-2 border-blue-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                 <div className="flex-1 flex flex-col items-center">
                    <label htmlFor="p2-name" className="text-lg font-semibold text-orange-800">Tên Bé 2</label>
                    <input 
                        type="text" 
                        id="p2-name"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value)}
                        className="w-full max-w-xs p-2 text-center bg-orange-100 border-2 border-orange-300 rounded-lg shadow-inner focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                </div>
            </div>
             <SettingsPanel
                title="Đếm tới"
                options={LIMIT_OPTIONS}
                selectedValue={maxCount}
                onChange={(val) => { setMaxCount(val); }}
                colorClasses="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                activeColorClasses="bg-yellow-500 ring-4 ring-yellow-300"
            />
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center px-4">
               <SettingsPanel
                    title="Bước đếm"
                    options={STEP_OPTIONS}
                    selectedValue={step}
                    onChange={(val) => { setStep(val); }}
                    colorClasses="bg-pink-400 hover:bg-pink-500 text-pink-900"
                    activeColorClasses="bg-pink-500 ring-4 ring-pink-300"
                />
                <SettingsPanel
                    title="Kiểu chữ"
                    options={FONT_OPTIONS}
                    selectedValue={fontClass}
                    onChange={(val) => setFontClass(val)}
                    colorClasses="bg-purple-400 hover:bg-purple-500 text-purple-900"
                    activeColorClasses="bg-purple-500 ring-4 ring-purple-300"
                />
            </div>
        </div>

        {/* Player 2 Area */}
        <PlayerUI 
            playerName={player2Name}
            playerState={p2State}
            handlers={p2Handlers}
            maxCount={maxCount}
            fontClass={fontClass}
            isFlipped={true}
            isDisabled={!!winner}
            colorScheme="orange"
        />
    </div>
  );
}

export default App;