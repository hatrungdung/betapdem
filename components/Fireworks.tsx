import React from 'react';

// Simple utility to create an array for mapping
const range = (size: number) => [...Array(size).keys()];

const Fireworks: React.FC = () => {
  const numFireworks = 15; // Number of fireworks to display

  return (
    <>
      <style>{`
        .firework {
            position: absolute;
        }

        .firework::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 100%;
            width: 3px;
            height: 15px;
            background: #fff;
            transform: translateX(-50%);
            opacity: 0.5;
            animation: firework-trail 0.5s ease-out forwards;
        }
        
        @keyframes firework-trail {
            from {
                transform: translateY(0) scaleY(1);
            }
            to {
                transform: translateY(-100px) scaleY(2);
                opacity: 0;
            }
        }

        .firework::after {
            content: '';
            position: absolute;
            left: 50%;
            top: 100%;
            width: 5px;
            height: 5px;
            background: var(--color, #fff);
            transform: translate(-50%, -100px);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--color, #fff), 0 0 20px var(--color, #fff);
            animation: firework-explode 0.8s ease-out forwards;
            opacity: 0;
        }

        @keyframes firework-explode {
            0% {
                transform: translate(-50%, -100px) scale(0);
                opacity: 1;
            }
            50% {
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -100px) scale(15);
                opacity: 0;
            }
        }
    `}</style>
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {range(numFireworks).map(i => {
          const top = `${Math.random() * 80 + 10}%`; // Random vertical position
          const left = `${Math.random() * 80 + 10}%`; // Random horizontal position
          const animationDelay = `${Math.random() * 2}s`; // Random start delay
          const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F1C40F'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div
              key={i}
              className="firework"
              style={{
                top,
                left,
                animationDelay,
                '--color': color
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </>
  );
};

export default Fireworks;