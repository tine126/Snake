
import React, { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import { GameMode, GameStatus, SkinId } from './types';
import { Trophy, Skull, Square, Globe, Grid3X3, Lock, Check } from 'lucide-react';
import { COMBO_TIMEOUT_MS, SKINS } from './constants';

const App: React.FC = () => {
  const {
    snake,
    food,
    particles,
    obstacles,
    direction,
    score,
    highScore,
    status,
    isMuted,
    mode,
    skin,
    combo,
    comboTimer,
    setMode,
    selectSkin,
    toggleMute,
    setStatus,
    resetGame,
    changeDirection,
  } = useSnakeGame();

  const [activeTab, setActiveTab] = useState<'MODE' | 'SKINS'>('MODE');

  const getModeIcon = (m: GameMode) => {
    switch (m) {
      case 'CLASSIC': return <Square size={16} />;
      case 'PORTAL': return <Globe size={16} />;
      case 'MAZE': return <Grid3X3 size={16} />;
    }
  };

  const getModeDescription = (m: GameMode) => {
    switch (m) {
        case 'CLASSIC': return "Standard rules.";
        case 'PORTAL': return "Walls wrap around.";
        case 'MAZE': return "Random obstacles.";
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-4 relative font-sans">
      
      {/* Header / Scoreboard */}
      <div className="w-full max-w-[500px] mb-6">
        <div className="flex justify-between items-end mb-4">
            <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm retro-font">
                SNAKE
            </h1>
            <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700 uppercase tracking-widest font-bold">
                    {mode}
                </span>
                <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">{skin} EDITION</span>
            </div>
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

        {/* Combo Bar */}
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden relative border border-gray-700/50">
            <div 
                className={`absolute left-0 top-0 h-full transition-all duration-100 ease-linear ${combo > 1 ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-emerald-500/30'}`}
                style={{ width: `${(comboTimer / COMBO_TIMEOUT_MS) * 100}%` }}
            />
            {combo > 1 && (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black z-10">
                    COMBO x{combo}
                </div>
            )}
        </div>
      </div>

      {/* Game Container */}
      <div className="relative w-full max-w-[500px]">
        <GameBoard 
            snake={snake} 
            food={food} 
            obstacles={obstacles}
            particles={particles} 
            direction={direction} 
            mode={mode}
            skin={skin}
            combo={combo}
        />

        {/* Start / Setup Screen */}
        {status === GameStatus.IDLE && (
           <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-start pt-8 rounded-lg z-20 text-center animate-in fade-in zoom-in duration-300 overflow-hidden">
              
              <div className="flex gap-4 mb-6 bg-gray-900 p-1 rounded-full">
                  <button 
                    onClick={() => setActiveTab('MODE')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'MODE' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    GAME MODE
                  </button>
                  <button 
                    onClick={() => setActiveTab('SKINS')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'SKINS' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    SKIN SHOP
                  </button>
              </div>
              
              <div className="w-full px-6 flex-1 overflow-y-auto no-scrollbar pb-20">
                {activeTab === 'MODE' && (
                    <div className="grid grid-cols-1 gap-3 w-full">
                        {(['CLASSIC', 'PORTAL', 'MAZE'] as GameMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left group ${
                                    mode === m 
                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                    : 'bg-gray-800/30 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${mode === m ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                    {getModeIcon(m)}
                                </div>
                                <div>
                                    <div className="font-bold text-sm tracking-wide">{m}</div>
                                    <div className="text-[10px] opacity-70 leading-tight">{getModeDescription(m)}</div>
                                </div>
                                {mode === m && <Check size={16} className="ml-auto" />}
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'SKINS' && (
                    <div className="grid grid-cols-1 gap-3 w-full">
                         {SKINS.map((s) => {
                             const isLocked = highScore < s.requiredScore;
                             const isSelected = skin === s.id;
                             return (
                                <button
                                    key={s.id}
                                    disabled={isLocked}
                                    onClick={() => selectSkin(s.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                                        isSelected
                                        ? 'bg-gray-800 border-white/50 ring-1 ring-white/20' 
                                        : isLocked 
                                            ? 'bg-gray-900/50 border-gray-800 opacity-60' 
                                            : 'bg-gray-800/30 border-gray-800 hover:bg-gray-800 hover:border-gray-700'
                                    }`}
                                >
                                    <div 
                                        className="w-8 h-8 rounded shadow-sm border border-white/10" 
                                        style={{ backgroundColor: s.primaryColor }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold text-sm tracking-wide ${isSelected ? 'text-white' : 'text-gray-300'}`}>{s.name}</span>
                                            {isLocked && <Lock size={12} className="text-gray-500" />}
                                        </div>
                                        <div className="text-[10px] text-gray-500">{isLocked ? `Unlock at ${s.requiredScore} pts` : s.description}</div>
                                    </div>
                                    {isSelected && <div className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-full">USED</div>}
                                </button>
                             )
                         })}
                    </div>
                )}
              </div>

              <div className="absolute bottom-6 w-full px-6">
                <button 
                    onClick={() => resetGame(mode)}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                    START GAME
                </button>
              </div>
           </div>
        )}

        {/* Game Over Screen */}
        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center rounded-lg z-20 animate-in fade-in duration-300 p-6 text-center">
             <Skull size={48} className="text-red-500 mb-2 animate-bounce" />
             <h2 className="text-3xl font-black text-white mb-1 tracking-wider">GAME OVER</h2>
             <p className="text-red-200 mb-8 font-mono">Final Score: <span className="text-white text-xl">{score}</span></p>
             
             <button 
                onClick={() => setStatus(GameStatus.IDLE)}
                className="w-full max-w-xs py-3 bg-white text-red-600 font-black rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 mb-3"
              >
                TRY AGAIN
              </button>
              <button 
                 onClick={() => setStatus(GameStatus.IDLE)}
                 className="text-red-300 text-sm hover:text-white underline"
              >
                Main Menu
              </button>
          </div>
        )}
        
        {status === GameStatus.PAUSED && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-lg">
                <div className="bg-gray-800/90 p-4 px-8 rounded-xl border border-gray-700 shadow-2xl flex items-center gap-3 animate-pulse">
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
        onRestart={() => setStatus(GameStatus.IDLE)}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
      
    </div>
  );
};

export default App;
