
import { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Direction, Point, Food, Particle, GameMode, SkinId } from '../types';
import {
  GRID_SIZE,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_DECREMENT,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTIONS,
  OBSTACLE_COUNT,
  COMBO_TIMEOUT_MS,
  SKINS
} from '../constants';
import { playSound } from '../utils/audio';

// Helper to check if a point exists in an array
const isPointInArray = (p: Point, array: Point[]) => {
  return array.some(item => item.x === p.x && item.y === p.y);
};

// Helper to generate random food
const generateFood = (snake: Point[], obstacles: Point[]): Food => {
  let newFood: Point;
  let isInvalid = true;

  while (isInvalid) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    
    const isOnSnake = isPointInArray(newFood, snake);
    const isOnObstacle = isPointInArray(newFood, obstacles);
    
    if (!isOnSnake && !isOnObstacle) {
        // 15% chance of Gold Food
        const type = Math.random() > 0.85 ? 'GOLD' : 'NORMAL';
        return { ...newFood, type };
    }
  }
  return { x: 0, y: 0, type: 'NORMAL' };
};

// Helper to generate obstacles
const generateObstacles = (snake: Point[]): Point[] => {
  const obstacles: Point[] = [];
  while (obstacles.length < OBSTACLE_COUNT) {
    const obstacle = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    // Keep distance from initial snake position to prevent instant death
    const distanceToSnake = Math.sqrt(
      Math.pow(obstacle.x - snake[0].x, 2) + Math.pow(obstacle.y - snake[0].y, 2)
    );

    if (distanceToSnake > 5 && !isPointInArray(obstacle, snake) && !isPointInArray(obstacle, obstacles)) {
      obstacles.push(obstacle);
    }
  }
  return obstacles;
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [obstacles, setObstacles] = useState<Point[]>([]);
  const [food, setFood] = useState<Food>({ x: 5, y: 5, type: 'NORMAL' });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<GameMode>('CLASSIC');
  const [skin, setSkin] = useState<SkinId>('NEON');
  
  // Combo System
  const [combo, setCombo] = useState(1);
  const [comboTimer, setComboTimer] = useState(0); // visual progress 0-100? No, let's track ms for logic
  
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  useEffect(() => {
    const storedScore = localStorage.getItem('snake-highscore');
    if (storedScore) setHighScore(parseInt(storedScore, 10));

    const storedSkin = localStorage.getItem('snake-skin');
    // Verify user actually owns this skin based on current score (optional validation, or just trust storage)
    if (storedSkin && SKINS.some(s => s.id === storedSkin)) {
        setSkin(storedSkin as SkinId);
    }

    setFood(generateFood(INITIAL_SNAKE, []));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [score, highScore]);

  // Save skin preference
  const selectSkin = useCallback((newSkin: SkinId) => {
    setSkin(newSkin);
    localStorage.setItem('snake-skin', newSkin);
  }, []);

  // Combo timer decrement
  useEffect(() => {
    if (status !== GameStatus.PLAYING || combo <= 1) return;
    
    const interval = setInterval(() => {
        setComboTimer((prev) => Math.max(0, prev - 100)); // decrease every 100ms
    }, 100);

    return () => clearInterval(interval);
  }, [status, combo]);

  useEffect(() => {
      if (comboTimer <= 0 && combo > 1) {
          setCombo(1);
      }
  }, [comboTimer, combo]);

  // Cleanup particles
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles([]);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const resetGame = useCallback((newMode?: GameMode) => {
    const selectedMode = newMode || mode;
    setMode(selectedMode);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setCombo(1);
    setComboTimer(0);
    setStatus(GameStatus.PLAYING);
    setSpeed(INITIAL_SPEED);
    setParticles([]);
    
    // Generate map
    const newObstacles = selectedMode === 'MAZE' ? generateObstacles(INITIAL_SNAKE) : [];
    setObstacles(newObstacles);
    setFood(generateFood(INITIAL_SNAKE, newObstacles));
    
    playSound('move', isMuted);
  }, [mode, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    if (OPPOSITE_DIRECTIONS[newDir] === directionRef.current) return;
    if (OPPOSITE_DIRECTIONS[newDir] !== nextDirectionRef.current) {
         if (OPPOSITE_DIRECTIONS[newDir] !== directionRef.current) {
             nextDirectionRef.current = newDir;
         }
    }
  }, []);

  const spawnParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
        newParticles.push({
            id: Math.random().toString(36).substr(2, 9),
            x,
            y,
            color,
            angle: (Math.PI * 2 * i) / 8,
            speed: Math.random() * 0.5 + 0.2
        });
    }
    setParticles(newParticles);
  };

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const currentMoveDir = nextDirectionRef.current;
      directionRef.current = currentMoveDir;
      setDirection(currentMoveDir);

      const head = prevSnake[0];
      const vector = DIRECTION_VECTORS[currentMoveDir];
      let newHead = { x: head.x + vector.x, y: head.y + vector.y };

      // Mode Specific Wall Logic
      if (mode === 'PORTAL') {
          if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
          else if (newHead.x >= GRID_SIZE) newHead.x = 0;
          else if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
          else if (newHead.y >= GRID_SIZE) newHead.y = 0;
      } else {
          // Classic & Maze: Die on Wall
          if (
            newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE
          ) {
            setStatus(GameStatus.GAME_OVER);
            playSound('die', isMuted);
            return prevSnake;
          }
      }

      // Obstacle Collision
      if (isPointInArray(newHead, obstacles)) {
          setStatus(GameStatus.GAME_OVER);
          playSound('die', isMuted);
          return prevSnake;
      }

      // Self Collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        playSound('die', isMuted);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const basePoints = food.type === 'GOLD' ? 50 : 10;
        const color = food.type === 'GOLD' ? '#FBBF24' : '#EF4444';
        
        // Update Combo
        const newCombo = Math.min(combo + 1, 5); // Max 5x combo
        setCombo(newCombo);
        setComboTimer(COMBO_TIMEOUT_MS);
        
        setScore((s) => s + (basePoints * combo));
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        spawnParticles(newHead.x, newHead.y, color);
        playSound(food.type === 'GOLD' ? 'bonus' : 'eat', isMuted);
        
        setFood(generateFood(newSnake, obstacles));
      } else {
        newSnake.pop();
        // Play tick sound only if not eating
        playSound('move', isMuted);
      }

      return newSnake;
    });
  }, [food, isMuted, mode, obstacles, combo]);

  useInterval(moveSnake, status === GameStatus.PLAYING ? speed : null);

  return {
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
  };
};
