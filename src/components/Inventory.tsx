import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Package, X } from 'lucide-react';

const Inventory: React.FC = () => {
  const { state, useItem } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const toggleInventory = () => {
    setIsOpen(!isOpen);
    setSelectedItemId(null); // Reset selected item when toggling
  };

  const selectItem = (itemId: string) => {
    setSelectedItemId(itemId === selectedItemId ? null : itemId);
  };

  const handleUseItem = (puzzleId: string) => {
    if (selectedItemId) {
      useItem(selectedItemId, puzzleId);
      setSelectedItemId(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleInventory}
        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
      >
        <Package className="h-5 w-5" />
        <span>Inventory ({state.inventory.length})</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-72 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Your Items</h3>
            <button onClick={toggleInventory} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          {state.inventory.length === 0 ? (
            <p className="text-gray-500 italic">Your inventory is empty.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {state.inventory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectItem(item.id)}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    selectedItemId === item.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  <div className="h-16 overflow-hidden rounded mb-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </div>
              ))}
            </div>
          )}

          {selectedItemId && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm mb-2">
                {state.inventory.find(i => i.id === selectedItemId)?.description}
              </p>
              <p className="text-xs text-blue-600">
                Click on a puzzle to use this item.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pass the selected item ID to parent components */}
      {selectedItemId && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 cursor-pointer"
             onClick={() => setSelectedItemId(null)}>
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
            <p className="text-sm font-medium">
              Select a puzzle to use {state.inventory.find(i => i.id === selectedItemId)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;