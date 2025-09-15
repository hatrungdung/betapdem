import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';

interface TomAndJerryProps {
  trigger: { key: number; number: number } | null;
}

const TomAndJerry: React.FC<TomAndJerryProps> = ({ trigger }) => {
  const [isActive, setIsActive] = useState(false);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (trigger) {
      setNumber(trigger.number);
      setIsActive(true);
      
      // Schedule the sound to play exactly when the hit animation starts
      const soundTimer = setTimeout(() => {
        playSound('hit');
      }, 1000); 

      const animationTimer = setTimeout(() => {
        setIsActive(false);
      }, 2000); // Total animation duration

      return () => {
        clearTimeout(soundTimer);
        clearTimeout(animationTimer);
      }
    }
  }, [trigger]);

  if (!isActive) {
    return null;
  }

  return (
    <div key={trigger?.key} className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      <style>{`
        @keyframes projectile-travel {
          0% {
            bottom: 6rem;
            transform: translateX(var(--x-start)) scale(0.5) rotate(var(--rotate-start));
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          50% {
            /* Add a mid-point for a curved trajectory */
            transform: translateX(var(--x-mid)) scale(3) rotate(0deg);
          }
          100% {
            bottom: calc(100vh - 5rem);
            transform: translateX(var(--x-end)) scale(5) rotate(var(--rotate-end));
            opacity: 0;
          }
        }
        .animate-projectile {
          animation: projectile-travel 1s cubic-bezier(0.25, 0.5, 0.75, 0.5) forwards;
        }

        @keyframes tom-hit {
          0%, 100% { transform: translateX(0) rotate(0); }
          20%, 60% { transform: translateX(-5px) rotate(-3deg); }
          40%, 80% { transform: translateX(5px) rotate(3deg); }
        }
        .animate-tom-hit {
          animation: tom-hit 0.5s ease-in-out 1s forwards;
        }
        
        @keyframes flower-explode {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
             opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-flower-explode {
          opacity: 0;
          animation: flower-explode 0.6s ease-out 1s forwards;
        }
      `}</style>
      
      {/* Tom (Cat) at the top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-5xl">
        <span className="inline-block animate-tom-hit">🐱</span>
        <span className="absolute top-0 left-0 text-5xl animate-flower-explode">🌸</span>
      </div>

      {/* Jerry (Mouse) at the bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">
        🐭
      </div>
      
      {/* Render multiple projectiles based on the milestone number */}
      {Array.from({ length: number }).map((_, i) => (
         <div 
            key={i}
            className="absolute left-1/2 -translate-x-1/2 text-4xl font-bold text-yellow-400 [text-shadow:2px_2px_0px_#f59e0b] animate-projectile"
            style={{
                // Stagger the animation start time for a "fountain" effect
                animationDelay: `${i * 0.08}s`,
                // Use CSS variables to create random trajectories for each number
                '--x-start': `${(Math.random() - 0.5) * 40}px`,
                '--x-mid': `${(Math.random() - 0.5) * 200}px`, // Mid-point for curve
                '--x-end': `${(Math.random() - 0.5) * 200}px`,
                '--rotate-start': `${(Math.random() - 0.5) * 30}deg`,
                '--rotate-end': `${(Math.random() - 0.5) * 30}deg`,
            } as React.CSSProperties}
          >
            {number}
         </div>
      ))}
    </div>
  );
};

export default TomAndJerry;