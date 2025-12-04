import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2, VolumeX, Menu } from 'lucide-react';
import { Direction, GameStatus } from '../types';

interface ControlsProps {
  onMove: (dir: Direction) => void;
  status: GameStatus;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onMove,
  status,
  onPause,
  onResume,
  onRestart,
  isMuted,
  toggleMute
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
        case 'm':
        case 'M':
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove, status, onPause, onResume, onRestart, toggleMute]);

  const btnClass = "p-5 bg-gray-800 rounded-2xl shadow-lg active:scale-95 transition-transform border border-gray-700 hover:bg-gray-700 active:bg-emerald-600/20 flex items-center justify-center";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto mt-auto pb-4 sm:mt-4">
      {/* Primary Action Buttons */}
      <div className="flex gap-4">
        {status === GameStatus.PLAYING ? (
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500/20 text-amber-500 border border-amber-500/50 rounded-full font-bold hover:bg-amber-500/30 transition-colors active:scale-95"
          >
            <Pause size={20} /> PAUSE
          </button>
        ) : status === GameStatus.PAUSED ? (
           <button
            onClick={onResume}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 rounded-full font-bold hover:bg-emerald-500/30 transition-colors active:scale-95"
          >
            <Play size={20} /> RESUME
          </button> 
        ) : (
             <button
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-gray-900 rounded-full font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95"
          >
            <Menu size={20} /> {status === GameStatus.IDLE ? 'SETUP' : 'MENU'}
          </button>
        )}
        
         <button
            onClick={toggleMute}
            className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors active:scale-95 border border-transparent hover:border-gray-700"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
      </div>

      {/* D-Pad for Mobile/Touch - Enlarged for better touch targets */}
      <div className="grid grid-cols-3 gap-3 touch-manipulation pb-safe">
        <div />
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.UP); }} aria-label="Up">
          <ArrowUp size={28} className="text-gray-300" />
        </button>
        <div />
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.LEFT); }} aria-label="Left">
          <ArrowLeft size={28} className="text-gray-300" />
        </button>
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.DOWN); }} aria-label="Down">
          <ArrowDown size={28} className="text-gray-300" />
        </button>
        <button className={btnClass} onPointerDown={(e) => { e.preventDefault(); onMove(Direction.RIGHT); }} aria-label="Right">
          <ArrowRight size={28} className="text-gray-300" />
        </button>
      </div>
      
       <div className="text-[10px] text-gray-600 font-mono mt-1 hidden sm:block">
            Keyboard: Arrow Keys / WASD
       </div>
    </div>
  );
};

export default Controls;