import React from 'react';
import { useGame } from '../context/GameContext';
import { Clock } from 'lucide-react';

const Timer: React.FC = () => {
  const { state } = useGame();
  
  // Format time remaining as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Determine color based on time remaining
  const getTimeColor = (): string => {
    if (state.timeRemaining <= 60) { // Last minute
      return 'text-red-600';
    } else if (state.timeRemaining <= 300) { // Last 5 minutes
      return 'text-orange-500';
    }
    return 'text-green-600';
  };

  return (
    <div className="flex items-center gap-2 text-xl font-bold">
      <Clock className="h-6 w-6" />
      <span className={getTimeColor()}>
        {formatTime(state.timeRemaining)}
      </span>
    </div>
  );
};

export default Timer;