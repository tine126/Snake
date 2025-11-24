import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { Direction, GameStatus } from '../types';

interface ControlsProps {
  onMove: (dir: Direction) => void;
  status: GameStatus;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onMove,
  status,
  onPause,
  onResume,
  onRestart,
}) => {
  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onMove(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onMove(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onMove(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onMove(Direction.RIGHT);
          break;
        case 'Escape':
        case ' ': // Spacebar
          if (status === GameStatus.PLAYING) onPause();
          else if (status === GameStatus.PAUSED) onResume();
          else if (status === GameStatus.GAME_OVER || status === GameStatus.IDLE) onRestart();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove, status, onPause, onResume, onRestart]);

  const btnClass = "p-4 bg-gray-800 rounded-xl shadow-lg active:scale-95 transition-transform border border-gray-700 hover:bg-gray-700 active:bg-emerald-600/20";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto mt-4">
      {/* Primary Action Buttons */}
      <div className="flex gap-4">
        {status === GameStatus.PLAYING ? (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-full font-bold hover:bg-amber-500/30 transition-colors"
          >
            <Pause size={20} /> PAUSE
          </button>
        ) : status === GameStatus.PAUSED ? (
           <button
            onClick={onResume}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 rounded-full font-bold hover:bg-emerald-500/30 transition-colors"
          >
            <Play size={20} /> RESUME
          </button> 
        ) : (
             <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-gray-900 rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >
            <Play size={20} /> {status === GameStatus.IDLE ? 'START GAME' : 'PLAY AGAIN'}
          </button>
        )}
        
         <button
            onClick={onRestart}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
      </div>

      {/* D-Pad for Mobile/Touch */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 touch-manipulation">
        <div />
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.UP); }} aria-label="Up">
          <ArrowUp size={24} className="text-gray-300" />
        </button>
        <div />
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.LEFT); }} aria-label="Left">
          <ArrowLeft size={24} className="text-gray-300" />
        </button>
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.DOWN); }} aria-label="Down">
          <ArrowDown size={24} className="text-gray-300" />
        </button>
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.RIGHT); }} aria-label="Right">
          <ArrowRight size={24} className="text-gray-300" />
        </button>
      </div>
      
       <div className="text-xs text-gray-500 font-mono mt-2">
            Use Arrow Keys or WASD to move. Space to Pause.
       </div>
    </div>
  );
};

export default Controls;
