import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import Puzzle from './Puzzle';
import { items } from '../data/gameData';
import { Item } from '../types';
import { ArrowRight } from 'lucide-react';

interface RoomProps {
  selectedItemId: string | null;
}

const Room: React.FC<RoomProps> = ({ selectedItemId }) => {
  const { state, collectItem, changeRoom } = useGame();
  const currentRoom = state.rooms[state.currentRoomId];
  const [showItemFound, setShowItemFound] = useState<Item | null>(null);
  
  // Randomly place an item in the room that the player hasn't collected yet
  const findItem = () => {
    const availableItems = items.filter(
      item => !state.inventory.some(i => i.id === item.id)
    );
    
    if (availableItems.length > 0) {
      // Randomly decide if player finds an item (30% chance)
      if (Math.random() < 0.3) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const foundItem = availableItems[randomIndex];
        
        collectItem(foundItem);
        setShowItemFound(foundItem);
        
        setTimeout(() => {
          setShowItemFound(null);
        }, 3000);
      }
    }
  };
  
  const handleNextRoom = () => {
    if (currentRoom.nextRoomId) {
      changeRoom(currentRoom.nextRoomId);
    }
  };
  
  // Check if all puzzles in the room are solved
  const allPuzzlesSolved = currentRoom.puzzles.every(puzzle => puzzle.solved);
  
  // Check if there's a next room to go to
  const hasNextRoom = currentRoom.nextRoomId !== undefined;
  
  // Check if next room is unlocked
  const nextRoomUnlocked = currentRoom.nextRoomId ? 
    !state.rooms[currentRoom.nextRoomId].isLocked : false;

  return (
    <div className="h-full flex flex-col">
      <div 
        className="relative h-48 bg-cover bg-center rounded-t-lg" 
        style={{ backgroundImage: `url(${currentRoom.image})` }}
        onClick={findItem}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg"></div>
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h2 className="text-2xl font-bold">{currentRoom.name}</h2>
          <p className="text-sm opacity-90">{currentRoom.theme} theme</p>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 rounded-b-lg flex-1 overflow-y-auto">
        <p className="text-gray-700 mb-4">{currentRoom.description}</p>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">Puzzles</h3>
          {currentRoom.puzzles.map(puzzle => (
            <Puzzle 
              key={puzzle.id} 
              puzzle={puzzle} 
              roomId={currentRoom.id}
              selectedItemId={selectedItemId}
            />
          ))}
        </div>
        
        {allPuzzlesSolved && hasNextRoom && (
          <button
            onClick={handleNextRoom}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <span>Continue to next room</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
        
        {allPuzzlesSolved && !hasNextRoom && (
          <div className="bg-purple-100 border border-purple-300 rounded-lg p-4 text-center">
            <h3 className="font-bold text-lg text-purple-800">
              Congratulations! You've solved all puzzles in this room.
            </h3>
            <p className="text-purple-700">
              This is the final room. You've escaped!
            </p>
          </div>
        )}
      </div>
      
      {showItemFound && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-2">Item Found!</h3>
            <div className="h-32 w-32 mx-auto mb-3">
              <img 
                src={showItemFound.image} 
                alt={showItemFound.name}
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <p className="font-bold text-lg">{showItemFound.name}</p>
            <p className="text-gray-600 mb-4">{showItemFound.description}</p>
            <p className="text-sm text-blue-600">Added to your inventory</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;