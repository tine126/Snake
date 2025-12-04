
import { Direction, Point, SkinId } from './types';

export const GRID_SIZE = 20; // 20x20 grid
export const INITIAL_SPEED = 150; // ms per tick
export const MIN_SPEED = 60;
export const SPEED_DECREMENT = 2; // speed up by 2ms every food eaten

export const COMBO_TIMEOUT_MS = 3000; // 3 seconds to keep combo
export const OBSTACLE_COUNT = 8; 

export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_DIRECTION = Direction.UP;

export const DIRECTION_VECTORS: Record<Direction, Point> = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
};

interface SkinConfig {
  id: SkinId;
  name: string;
  description: string;
  requiredScore: number;
  primaryColor: string; // For UI preview
}

export const SKINS: SkinConfig[] = [
  { 
    id: 'NEON', 
    name: 'Neon Green', 
    description: 'The classic experience.', 
    requiredScore: 0,
    primaryColor: '#10B981' // emerald-500
  },
  { 
    id: 'CYBER', 
    name: 'Cyberpunk', 
    description: 'High-tech blue & purple.', 
    requiredScore: 50,
    primaryColor: '#06B6D4' // cyan-500
  },
  { 
    id: 'MONO', 
    name: 'Retro Bit', 
    description: 'Old school pixels.', 
    requiredScore: 150,
    primaryColor: '#9CA3AF' // gray-400
  },
  { 
    id: 'GOLD', 
    name: 'Luxury Gold', 
    description: 'For the elite.', 
    requiredScore: 300,
    primaryColor: '#FBBF24' // amber-400
  },
  { 
    id: 'RAINBOW', 
    name: 'Prism', 
    description: 'Dynamic RGB flow.', 
    requiredScore: 500,
    primaryColor: '#EC4899' // pink-500
  },
];
