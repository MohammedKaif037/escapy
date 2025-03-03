export interface Item {
  id: string;
  name: string;
  description: string;
  image: string;
  canBeUsed: boolean;
  usedOn?: string; // ID of the puzzle this item can be used on
}

export interface Puzzle {
  id: string;
  type: 'riddle' | 'pattern' | 'combination' | 'item';
  solved: boolean;
  description: string;
  solution: string;
  hint: string;
  requiredItemId?: string; // For puzzles that require an item to solve
}

export interface Room {
  id: string;
  name: string;
  theme: 'mystery' | 'sci-fi' | 'horror';
  description: string;
  image: string;
  puzzles: Puzzle[];
  nextRoomId?: string; // ID of the room that unlocks when all puzzles are solved
  isLocked: boolean;
}

export interface GameState {
  currentRoomId: string;
  inventory: Item[];
  rooms: Record<string, Room>;
  timeRemaining: number; // in seconds
  hintsUsed: number;
  maxHints: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameWon: boolean;
}