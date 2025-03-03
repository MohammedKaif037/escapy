import React from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Trophy, Frown } from 'lucide-react';

const GameOver: React.FC = () => {
  const { state, dispatch } = useGame();
  
  // Calculate score based on time remaining and hints used
  const calculateScore = () => {
    if (!state.gameWon) return 0;
    
    const timeBonus = Math.floor(state.timeRemaining / 60) * 10; // 10 points per minute remaining
    const hintPenalty = state.hintsUsed * 15; // -15 points per hint used
    
    return Math.max(100 + timeBonus - hintPenalty, 0);
  };
  
  const restartGame = () => {
    // Reload the page to restart the game
    window.location.reload();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          {state.gameWon ? (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                Congratulations!
              </h2>
              <p className="text-xl">You've escaped all the rooms!</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Frown className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-2">
                Time's Up!
              </h2>
              <p className="text-xl">You couldn't escape in time.</p>
            </>
          )}
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-3">Game Summary</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className="font-medium">
                  {Math.floor(state.timeRemaining / 60)}m {state.timeRemaining % 60}s
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Hints Used</p>
              <p className="font-medium">{state.hintsUsed} of {state.maxHints}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Rooms Completed</p>
              <p className="font-medium">
                {Object.values(state.rooms).filter(room => 
                  room.puzzles.every(puzzle => puzzle.solved)
                ).length} of {Object.keys(state.rooms).length}
              </p>
            </div>
            
            {state.gameWon && (
              <div>
                <p className="text-sm text-gray-600">Final Score</p>
                <p className="font-bold text-lg text-purple-600">{calculateScore()}</p>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={restartGame}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;