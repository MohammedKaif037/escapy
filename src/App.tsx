import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Room from './components/Room';
import Timer from './components/Timer';
import Inventory from './components/Inventory';
import HintSystem from './components/HintSystem';
import GameOver from './components/GameOver';
import StartScreen from './components/StartScreen';

const GameContent: React.FC = () => {
  const { state } = useGame();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Listen for inventory item selection from child components
  useEffect(() => {
    const handleItemSelection = (event: CustomEvent<string>) => {
      setSelectedItemId(event.detail);
    };

    window.addEventListener('itemSelected' as any, handleItemSelection);
    return () => {
      window.removeEventListener('itemSelected' as any, handleItemSelection);
    };
  }, []);

  if (!state.gameStarted) {
    return <StartScreen />;
  }

  if (state.gameOver) {
    return <GameOver />;
  }

  return (
    <div className="h-full flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Escape Room Challenge</h1>
          <Timer />
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 overflow-hidden flex flex-col">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-1 flex flex-col">
          <Room selectedItemId={selectedItemId} />
        </div>
      </main>

      <footer className="bg-gray-100 border-t p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">Room:</span> {state.currentRoomId}
          </div>
          <div className="flex gap-3">
            <HintSystem />
            <Inventory />
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <GameContent />
      </div>
    </GameProvider>
  );
}

export default App;