import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Item, Puzzle } from '../types';
import { initialGameState } from '../data/gameData';

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'COLLECT_ITEM'; item: Item }
  | { type: 'USE_ITEM'; itemId: string; puzzleId: string }
  | { type: 'SOLVE_PUZZLE'; roomId: string; puzzleId: string; answer?: string }
  | { type: 'CHANGE_ROOM'; roomId: string }
  | { type: 'USE_HINT' }
  | { type: 'TICK_TIMER' }
  | { type: 'END_GAME'; won: boolean };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        gameStarted: true,
      };

    case 'COLLECT_ITEM':
      return {
        ...state,
        inventory: [...state.inventory, action.item],
      };

    case 'USE_ITEM': {
      const { itemId, puzzleId } = action;
      const currentRoom = state.rooms[state.currentRoomId];
      
      // Find the puzzle in the current room
      const puzzleIndex = currentRoom.puzzles.findIndex(p => p.id === puzzleId);
      if (puzzleIndex === -1) return state;
      
      const puzzle = currentRoom.puzzles[puzzleIndex];
      
      // Check if this is the correct item for the puzzle
      if (puzzle.type === 'item' && puzzle.solution === itemId) {
        // Create updated puzzles array with this puzzle marked as solved
        const updatedPuzzles = [...currentRoom.puzzles];
        updatedPuzzles[puzzleIndex] = { ...puzzle, solved: true };
        
        // Remove the item from inventory
        const updatedInventory = state.inventory.filter(item => item.id !== itemId);
        
        // Check if all puzzles in the room are solved
        const allPuzzlesSolved = updatedPuzzles.every(p => p.solved);
        
        // Update the room with solved puzzle
        const updatedRooms = {
          ...state.rooms,
          [state.currentRoomId]: {
            ...currentRoom,
            puzzles: updatedPuzzles
          }
        };
        
        // If this room has a next room and all puzzles are solved, unlock the next room
        if (allPuzzlesSolved && currentRoom.nextRoomId) {
          updatedRooms[currentRoom.nextRoomId] = {
            ...state.rooms[currentRoom.nextRoomId],
            isLocked: false
          };
        }
        
        return {
          ...state,
          inventory: updatedInventory,
          rooms: updatedRooms,
          gameWon: allPuzzlesSolved && !currentRoom.nextRoomId
        };
      }
      
      return state;
    }

    case 'SOLVE_PUZZLE': {
      const { roomId, puzzleId, answer } = action;
      const room = state.rooms[roomId];
      
      // Find the puzzle in the room
      const puzzleIndex = room.puzzles.findIndex(p => p.id === puzzleId);
      if (puzzleIndex === -1) return state;
      
      const puzzle = room.puzzles[puzzleIndex];
      
      // For non-item puzzles, check if the answer is correct (if provided)
      if (answer && puzzle.type !== 'item' && puzzle.solution.toLowerCase() !== answer.toLowerCase()) {
        return state; // Answer is incorrect
      }
      
      // Create updated puzzles array with this puzzle marked as solved
      const updatedPuzzles = [...room.puzzles];
      updatedPuzzles[puzzleIndex] = { ...puzzle, solved: true };
      
      // Check if all puzzles in the room are solved
      const allPuzzlesSolved = updatedPuzzles.every(p => p.solved);
      
      // Update the rooms
      const updatedRooms = {
        ...state.rooms,
        [roomId]: {
          ...room,
          puzzles: updatedPuzzles
        }
      };
      
      // If this room has a next room and all puzzles are solved, unlock the next room
      if (allPuzzlesSolved && room.nextRoomId) {
        updatedRooms[room.nextRoomId] = {
          ...state.rooms[room.nextRoomId],
          isLocked: false
        };
      }
      
      return {
        ...state,
        rooms: updatedRooms,
        gameWon: allPuzzlesSolved && !room.nextRoomId
      };
    }

    case 'CHANGE_ROOM':
      return {
        ...state,
        currentRoomId: action.roomId
      };

    case 'USE_HINT':
      return {
        ...state,
        hintsUsed: state.hintsUsed + 1
      };

    case 'TICK_TIMER': {
      const newTimeRemaining = state.timeRemaining - 1;
      const gameOver = newTimeRemaining <= 0;
      
      return {
        ...state,
        timeRemaining: newTimeRemaining,
        gameOver: gameOver
      };
    }

    case 'END_GAME':
      return {
        ...state,
        gameOver: true,
        gameWon: action.won
      };

    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  collectItem: (item: Item) => void;
  useItem: (itemId: string, puzzleId: string) => void;
  solvePuzzle: (roomId: string, puzzleId: string, answer: string) => boolean;
  changeRoom: (roomId: string) => void;
  useHint: () => string | null;
  startGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    
    if (state.gameStarted && !state.gameOver && !state.gameWon) {
      timer = window.setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.gameStarted, state.gameOver, state.gameWon]);

  // Check for game over conditions
  useEffect(() => {
    if (state.timeRemaining <= 0 && !state.gameOver) {
      dispatch({ type: 'END_GAME', won: false });
    }
    
    if (state.gameWon && !state.gameOver) {
      dispatch({ type: 'END_GAME', won: true });
    }
  }, [state.timeRemaining, state.gameWon, state.gameOver]);

  const collectItem = (item: Item) => {
    dispatch({ type: 'COLLECT_ITEM', item });
  };

  const useItem = (itemId: string, puzzleId: string) => {
    dispatch({ type: 'USE_ITEM', itemId, puzzleId });
  };

  const solvePuzzle = (roomId: string, puzzleId: string, answer: string): boolean => {
    const puzzle = state.rooms[roomId].puzzles.find(p => p.id === puzzleId);
    
    if (!puzzle || puzzle.solved) return false;
    
    // For non-item puzzles, check if the answer is correct
    if (puzzle.type !== 'item' && puzzle.solution.toLowerCase() === answer.toLowerCase()) {
      dispatch({ type: 'SOLVE_PUZZLE', roomId, puzzleId, answer });
      return true;
    }
    
    return false;
  };

  const changeRoom = (roomId: string) => {
    dispatch({ type: 'CHANGE_ROOM', roomId });
  };

  const useHint = (): string | null => {
    if (state.hintsUsed >= state.maxHints) {
      return null; // No more hints available
    }
    
    const currentRoom = state.rooms[state.currentRoomId];
    const unsolvedPuzzle = currentRoom.puzzles.find(p => !p.solved);
    
    if (unsolvedPuzzle) {
      dispatch({ type: 'USE_HINT' });
      return unsolvedPuzzle.hint;
    }
    
    return null;
  };

  const startGame = () => {
    dispatch({ type: 'START_GAME' });
  };

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        collectItem,
        useItem,
        solvePuzzle,
        changeRoom,
        useHint,
        startGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};