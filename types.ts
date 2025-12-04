
export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER',
}

export type FoodType = 'NORMAL' | 'GOLD';
export type GameMode = 'CLASSIC' | 'PORTAL' | 'MAZE';
export type SkinId = 'NEON' | 'CYBER' | 'GOLD' | 'MONO' | 'RAINBOW';

export interface Food extends Point {
  type: FoodType;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  angle: number; // in radians
  speed: number;
}

export interface GameState {
  snake: Point[];
  food: Food;
  direction: Direction;
  score: number;
  highScore: number;
  status: GameStatus;
  speed: number;
  mode: GameMode;
  skin: SkinId;
  obstacles: Point[];
  combo: number;
  comboTimer: number; // 0 to 100
}
