import React, { useState } from 'react';
import { Puzzle as PuzzleType } from '../types';
import { useGame } from '../context/GameContext';
import { CheckCircle, Lock } from 'lucide-react';

interface PuzzleProps {
  puzzle: PuzzleType;
  roomId: string;
  selectedItemId: string | null;
}

const Puzzle: React.FC<PuzzleProps> = ({ puzzle, roomId, selectedItemId }) => {
  const { solvePuzzle, useItem } = useGame();
  const [answer, setAnswer] = useState('');
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (puzzle.type === 'item') {
      return; // Item puzzles are solved by using items, not submitting answers
    }
    
    const solved = solvePuzzle(roomId, puzzle.id, answer);
    
    if (!solved) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    } else {
      setAnswer('');
    }
  };

  const handleItemUse = () => {
    if (selectedItemId && puzzle.type === 'item') {
      useItem(selectedItemId, puzzle.id);
    }
  };

  if (puzzle.solved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <CheckCircle className="h-5 w-5" />
          <h3 className="font-bold">Puzzle Solved!</h3>
        </div>
        <p className="text-gray-600">{puzzle.description}</p>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border rounded-lg p-4 mb-4 ${
        selectedItemId ? 'cursor-pointer border-blue-300 hover:border-blue-500' : 'border-gray-200'
      }`}
      onClick={selectedItemId ? handleItemUse : undefined}
    >
      <div className="flex items-start gap-2 mb-3">
        {puzzle.type === 'item' ? (
          <Lock className="h-5 w-5 text-amber-600 mt-1" />
        ) : (
          <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            ?
          </div>
        )}
        <h3 className="font-bold">{puzzle.type === 'item' ? 'Locked Object' : 'Puzzle'}</h3>
      </div>
      
      <p className="text-gray-700 mb-4">{puzzle.description}</p>
      
      {puzzle.type !== 'item' && (
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Solve
            </button>
          </div>
          {showError && (
            <p className="text-red-500 text-sm mt-1">
              That's not the correct answer. Try again!
            </p>
          )}
        </form>
      )}
      
      {puzzle.type === 'item' && selectedItemId && (
        <div className="mt-2 text-blue-600 text-sm">
          Click to use selected item on this object
        </div>
      )}
      
      {puzzle.type === 'item' && !selectedItemId && (
        <div className="mt-2 text-gray-500 text-sm italic">
          This requires a specific item to unlock
        </div>
      )}
    </div>
  );
};

export default Puzzle;