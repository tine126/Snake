import React from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import { GameStatus } from './types';
import { Trophy, Skull } from 'lucide-react';

const App: React.FC = () => {
  const {
    snake,
    food,
    direction,
    score,
    highScore,
    status,
    setStatus,
    resetGame,
    changeDirection,
  } = useSnakeGame();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4 relative">
      
      {/* Header / Scoreboard */}
      <div className="w-full max-w-[500px] flex justify-between items-end mb-6">
        <div>
           <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm retro-font">
            SNAKE
           </h1>
           <div className="text-xs text-gray-500 font-mono tracking-widest mt-1">NEON EDITION</div>
        </div>
        
        <div className="flex gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Best</span>
                <div className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xl">
                    <Trophy size={14} />
                    {highScore}
                </div>
            </div>
            <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Score</span>
                <div className="text-emerald-400 font-mono font-bold text-3xl tabular-nums leading-none">
                    {score}
                </div>
            </div>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-[500px]">
        <GameBoard snake={snake} food={food} direction={direction} />

        {/* Overlays */}
        {status === GameStatus.IDLE && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
              <div className="text-center animate-bounce mb-4">
                <span className="text-6xl">🐍</span>
              </div>
              <p className="text-gray-300 font-bold mb-4">Ready to play?</p>
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 active:scale-95"
              >
                START GAME
              </button>
           </div>
        )}

        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 bg-red-900/80 backdrop-blur-md flex flex-col items-center justify-center rounded-lg z-20 animate-in fade-in duration-300">
             <Skull size={48} className="text-white mb-2" />
             <h2 className="text-3xl font-black text-white mb-1 tracking-wider">GAME OVER</h2>
             <p className="text-red-200 mb-6 font-mono">Final Score: {score}</p>
             <button 
                onClick={resetGame}
                className="px-8 py-3 bg-white text-red-600 font-black rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95"
              >
                TRY AGAIN
              </button>
          </div>
        )}
        
        {status === GameStatus.PAUSED && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-lg">
                <div className="bg-gray-800/90 p-4 px-8 rounded-xl border border-gray-700 shadow-2xl flex items-center gap-3">
                     <span className="font-bold tracking-widest text-xl">PAUSED</span>
                </div>
            </div>
        )}
      </div>

      {/* Controls */}
      <Controls 
        onMove={changeDirection}
        status={status}
        onPause={() => setStatus(GameStatus.PAUSED)}
        onResume={() => setStatus(GameStatus.PLAYING)}
        onRestart={resetGame}
      />
      
    </div>
  );
};

export default App;
