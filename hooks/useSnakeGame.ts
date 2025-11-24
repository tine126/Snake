import { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Direction, Point } from '../types';
import {
  GRID_SIZE,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_DECREMENT,
  DIRECTION_VECTORS,
  OPPOSITE_DIRECTIONS,
} from '../constants';

// Helper to generate random food position not on snake
const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  let isOnSnake = true;

  while (isOnSnake) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) return newFood;
  }
  return { x: 0, y: 0 }; // Fallback
};

// Custom interval hook for the game loop
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  // Track the direction currently being rendered to prevent 180-degree turns within a single tick
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION);

  useEffect(() => {
    const stored = localStorage.getItem('snake-highscore');
    if (stored) setHighScore(parseInt(stored, 10));
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [score, highScore]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setStatus(GameStatus.PLAYING);
    setSpeed(INITIAL_SPEED);
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    // Prevent reversing direction
    if (OPPOSITE_DIRECTIONS[newDir] === directionRef.current) return;
    // prevent multiple rapid key presses changing direction multiple times before a tick
    // However, we need to allow the *latest* valid keypress to be queued if we want a buffer, 
    // or simply just update the ref.
    // The issue with just updating state is that if I press Left then Down quickly, 
    // render happens, but tick hasn't.
    // We update `nextDirectionRef` here, and apply it in the loop.
    
    // Check if the new direction is opposite to the *last processed* direction (directionRef.current)
    // Actually, to be safer against rapid inputs, we should check against the current *state* direction or last ref
    // For simplicity: We queue the move.
    
    if (OPPOSITE_DIRECTIONS[newDir] !== nextDirectionRef.current) {
         // Also check if it's opposite to the currently executing direction (to prevent 180 in 1 tick)
         if (OPPOSITE_DIRECTIONS[newDir] !== directionRef.current) {
             nextDirectionRef.current = newDir;
         }
    }
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      // Update actual direction from the queued direction
      const currentMoveDir = nextDirectionRef.current;
      directionRef.current = currentMoveDir;
      setDirection(currentMoveDir);

      const head = prevSnake[0];
      const vector = DIRECTION_VECTORS[currentMoveDir];
      const newHead = { x: head.x + vector.x, y: head.y + vector.y };

      // 1. Check Wall Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      // 2. Check Self Collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 3. Check Food Collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(generateFood(newSnake));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food]);

  useInterval(
    moveSnake,
    status === GameStatus.PLAYING ? speed : null
  );

  return {
    snake,
    food,
    direction,
    score,
    highScore,
    status,
    setStatus,
    resetGame,
    changeDirection,
  };
};
