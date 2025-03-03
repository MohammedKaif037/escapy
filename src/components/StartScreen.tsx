import React from 'react';
import { useGame } from '../context/GameContext';
import { DoorOpen, Clock, HelpCircle, Package } from 'lucide-react';

const StartScreen: React.FC = () => {
  const { startGame } = useGame();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Escape Room Challenge</h1>
          <p className="text-gray-600">
            Solve puzzles, find items, and escape from themed rooms before time runs out!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-blue-800">30 Minute Timer</h3>
            </div>
            <p className="text-sm text-gray-700">
              You have 30 minutes to escape from all rooms. The timer starts as soon as you begin.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-purple-600" />
              <h3 className="font-bold text-purple-800">Limited Hints</h3>
            </div>
            <p className="text-sm text-gray-700">
              You have 5 hints available. Use them wisely when you're stuck on a puzzle.
            </p>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-amber-800">Collect Items</h3>
            </div>
            <p className="text-sm text-gray-700">
              Find and use items to solve puzzles. Click around the room to discover hidden objects.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DoorOpen className="h-5 w-5 text-green-600" />
              <h3 className="font-bold text-green-800">Multiple Rooms</h3>
            </div>
            <p className="text-sm text-gray-700">
              Solve all puzzles in a room to unlock the next one. Each room has a unique theme and challenges.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2">How to Play:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Examine each room carefully and solve all puzzles</li>
            <li>• Click around the room to find hidden items</li>
            <li>• Use your inventory items on locked objects</li>
            <li>• Solve all rooms before time runs out</li>
          </ul>
        </div>

        <button
          onClick={startGame}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-bold text-lg transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default StartScreen;