
import React, { useMemo } from 'react';
import { Point, Direction, Food, Particle, GameMode, SkinId } from '../types';
import { GRID_SIZE, COMBO_TIMEOUT_MS } from '../constants';
import { Zap, Star, XCircle } from 'lucide-react';

interface GameBoardProps {
  snake: Point[];
  food: Food;
  obstacles: Point[];
  particles: Particle[];
  direction: Direction;
  mode: GameMode;
  skin: SkinId;
  combo: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, obstacles, particles, direction, mode, skin, combo }) => {
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  // Define skin-specific styles
  const skinStyles = useMemo(() => {
    const isMono = skin === 'MONO';
    const rounded = isMono ? '' : 'rounded-sm';
    
    switch (skin) {
        case 'CYBER':
            return {
                head: `bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] ${rounded}`,
                body: `bg-indigo-500 shadow-sm ${rounded}`,
                border: 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            };
        case 'GOLD':
            return {
                head: `bg-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.9)] ${rounded}`,
                body: `bg-amber-600 shadow-sm border border-amber-400/30 ${rounded}`,
                border: 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
            };
        case 'MONO':
            return {
                head: `bg-gray-100 ${rounded}`,
                body: `bg-gray-400 ${rounded}`,
                border: 'border-gray-500 shadow-none'
            };
        case 'RAINBOW':
            return {
                head: `bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] ${rounded}`,
                body: `shadow-sm ${rounded}`, // Color handled dynamically
                border: 'border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
            };
        case 'NEON':
        default:
            return {
                head: `bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] ${rounded}`,
                body: `bg-emerald-600 shadow-sm ${rounded}`,
                border: 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
            };
    }
  }, [skin]);

  const getCellClass = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);

    const isFood = food.x === x && food.y === y;
    const isObstacle = obstacles.some(o => o.x === x && o.y === y);
    const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
    const isHead = snakeIndex === 0;
    const isBody = snakeIndex > 0;
    const isMono = skin === 'MONO';

    let baseClass = `w-full h-full ${isMono ? '' : 'rounded-sm'} transition-all duration-75 relative `;

    if (isObstacle) {
        return `${baseClass} ${isMono ? 'bg-gray-500' : 'bg-gray-600 border border-gray-500 rounded-md shadow-inner'}`;
    }

    if (isFood) {
      if (food.type === 'GOLD') {
         return `${baseClass} bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.9)] scale-95 animate-pulse ${isMono ? '' : 'rounded-full'}`;
      }
      return `${baseClass} bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-90 animate-pulse ${isMono ? '' : 'rounded-full'}`;
    }
    
    if (isHead) {
      let rotateClass = '';
      if (direction === Direction.RIGHT) rotateClass = 'rotate-90';
      if (direction === Direction.DOWN) rotateClass = 'rotate-180';
      if (direction === Direction.LEFT) rotateClass = '-rotate-90';
      
      // Override specific head color if portal mode is active AND skin is neon/default to show distinction
      // But if skin is custom, keep custom skin head
      let finalHeadClass = skinStyles.head;
      if (skin === 'NEON' && mode === 'PORTAL') {
          finalHeadClass = 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] rounded-sm';
      }

      return `${baseClass} ${finalHeadClass} z-10 ${rotateClass}`;
    }
    
    if (isBody) {
      let bodyClass = skinStyles.body;
      
      // Portal mode default body override
      if (skin === 'NEON' && mode === 'PORTAL') {
          bodyClass = 'bg-cyan-600 shadow-sm rounded-sm';
      }

      return `${baseClass} ${bodyClass}`;
    }

    // Grid Background
    if (skin === 'MONO') {
        return `${baseClass} bg-gray-800 border-[0.5px] border-gray-700/50`;
    }
    return `${baseClass} bg-gray-800/50 border border-gray-700/20`;
  };

  const getDynamicBodyStyle = (index: number) => {
      const x = index % GRID_SIZE;
      const y = Math.floor(index / GRID_SIZE);
      const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
      
      if (skin === 'RAINBOW' && snakeIndex >= 0) {
          // Calculate hue based on index to create flowing rainbow
          const hue = (snakeIndex * 20) % 360;
          return { backgroundColor: `hsl(${hue}, 80%, 60%)` };
      }
      return {};
  };

  const renderEyes = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    const isHead = snake[0].x === x && snake[0].y === y;

    if (isHead) {
        return (
            <div className="absolute inset-0 flex justify-center items-center gap-[2px] -mt-[2px]">
                <div className={`w-1.5 h-1.5 ${skin === 'MONO' ? 'bg-gray-800 rounded-none' : 'bg-black rounded-full'} animate-blink`}></div>
                <div className={`w-1.5 h-1.5 ${skin === 'MONO' ? 'bg-gray-800 rounded-none' : 'bg-black rounded-full'} animate-blink`}></div>
            </div>
        )
    }
    return null;
  }
  
  const renderIcon = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    
    if (obstacles.some(o => o.x === x && o.y === y)) {
         return <XCircle size={14} className="text-gray-400 opacity-50 absolute inset-0 m-auto" />;
    }

    if (food.x === x && food.y === y) {
        if (food.type === 'GOLD') {
             return <Star size={12} className="text-white absolute inset-0 m-auto animate-spin-slow" fill="white" />;
        }
        return <Zap size={12} className="text-white absolute inset-0 m-auto" fill="white" />;
    }
    return null;
  }

  // Container border calculation
  const getContainerStyle = () => {
      let baseStyle = 'border-2';
      
      // Mode overrides border style (dashed/double)
      if (mode === 'PORTAL') baseStyle = 'border-4 border-dashed';
      if (mode === 'MAZE') baseStyle = 'border-4 border-double';

      // Skin overrides color
      return `${baseStyle} ${skinStyles.border}`;
  }

  return (
    <div className="relative w-full max-w-[500px]">
        
        {/* Combo Indicator Popup */}
        {combo > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
                <div className="bg-amber-400 text-black font-black text-xl italic px-4 py-1 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] rotate-[-5deg]">
                    {combo}x COMBO!
                </div>
            </div>
        )}

        <div
        className={`grid gap-[1px] bg-gray-900 p-1 rounded-lg overflow-hidden transition-all duration-500 ${getContainerStyle()}`}
        style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            aspectRatio: '1/1',
        }}
        >
            {/* Background Grid Lines Effect - Hidden for Mono */}
            {skin !== 'MONO' && (
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
            )}

        {cells.map((_, i) => (
            <div key={i} className="relative aspect-square">
                <div className={getCellClass(i)} style={getDynamicBodyStyle(i)}>
                    {renderEyes(i)}
                    {renderIcon(i)}
                </div>
            </div>
        ))}
        
        {/* Particle Overlay */}
        {particles.map((p) => (
            <div
                key={p.id}
                className="absolute w-2 h-2 rounded-full pointer-events-none z-20 animate-particle-fade"
                style={{
                    left: `calc(${(p.x / GRID_SIZE) * 100}% + 2%)`,
                    top: `calc(${(p.y / GRID_SIZE) * 100}% + 2%)`,
                    backgroundColor: p.color,
                    '--tx': `${Math.cos(p.angle) * 50}px`,
                    '--ty': `${Math.sin(p.angle) * 50}px`,
                    boxShadow: `0 0 10px ${p.color}`
                } as React.CSSProperties}
            />
        ))}
        </div>
        
        <style>{`
            @keyframes particle-fade {
                0% { transform: translate(0, 0) scale(1.5); opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
            }
            .animate-particle-fade {
                animation: particle-fade 0.6s ease-out forwards;
            }
            .animate-spin-slow {
                animation: spin 3s linear infinite;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
    </div>
  );
};

export default GameBoard;
