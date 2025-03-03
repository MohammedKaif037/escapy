import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { HelpCircle } from 'lucide-react';

const HintSystem: React.FC = () => {
  const { state, useHint } = useGame();
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);

  const handleUseHint = () => {
    const hint = useHint();
    setCurrentHint(hint);
    setShowHintModal(true);
  };

  const closeHintModal = () => {
    setShowHintModal(false);
    setCurrentHint(null);
  };

  const hintsRemaining = state.maxHints - state.hintsUsed;

  return (
    <div className="relative">
      <button
        onClick={handleUseHint}
        disabled={hintsRemaining <= 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          hintsRemaining > 0
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <HelpCircle className="h-5 w-5" />
        <span>Hint ({hintsRemaining})</span>
      </button>

      {showHintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Hint</h3>
            
            {currentHint ? (
              <p className="mb-6 text-gray-700">{currentHint}</p>
            ) : (
              <p className="mb-6 text-red-500">
                No more hints available! Try to solve the puzzle on your own.
              </p>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={closeHintModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HintSystem;