import React from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';
import { Zap } from 'lucide-react';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  direction: Direction;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, direction }) => {
  // Create grid cells
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE });

  // Helper to determine if a cell is part of snake or food
  const getCellClass = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);

    const isFood = food.x === x && food.y === y;
    const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
    const isHead = snakeIndex === 0;
    const isBody = snakeIndex > 0;

    let baseClass = "w-full h-full rounded-sm transition-all duration-75 border-opacity-5 ";

    if (isFood) {
      return `${baseClass} bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-90 animate-pulse rounded-full`;
    }
    
    if (isHead) {
      // Rotation for eyes based on direction
      let rotateClass = '';
      if (direction === Direction.RIGHT) rotateClass = 'rotate-90';
      if (direction === Direction.DOWN) rotateClass = 'rotate-180';
      if (direction === Direction.LEFT) rotateClass = '-rotate-90';
      
      return `${baseClass} bg-emerald-400 z-10 shadow-[0_0_15px_rgba(52,211,153,0.6)] relative ${rotateClass}`;
    }
    
    if (isBody) {
      // Fade opacity slightly towards tail
      const opacity = Math.max(0.4, 1 - snakeIndex / (snake.length + 5));
      return `${baseClass} bg-emerald-600 shadow-sm`;
    }

    return `${baseClass} bg-gray-800/50 border border-gray-700/20`;
  };

  const renderEyes = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    const isHead = snake[0].x === x && snake[0].y === y;

    if (isHead) {
        return (
            <div className="absolute inset-0 flex justify-center items-center gap-[2px] -mt-[2px]">
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-blink"></div>
                <div className="w-1.5 h-1.5 bg-black rounded-full animate-blink"></div>
            </div>
        )
    }
    return null;
  }
  
  const renderFoodIcon = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);
    if(food.x === x && food.y === y) {
        return <Zap size={12} className="text-white absolute inset-0 m-auto" fill="white" />;
    }
    return null;
  }

  return (
    <div
      className="grid gap-[1px] bg-gray-900 p-1 rounded-lg border-2 border-gray-700 shadow-2xl relative overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
        aspectRatio: '1/1',
        width: '100%',
        maxWidth: '500px',
      }}
    >
        {/* Background Grid Lines Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

      {cells.map((_, i) => (
        <div key={i} className="relative aspect-square">
            <div className={getCellClass(i)}>
                {renderEyes(i)}
                {renderFoodIcon(i)}
            </div>
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
