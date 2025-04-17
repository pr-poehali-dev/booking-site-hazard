import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface TimeSlotButtonProps {
  time: string;
  isBooked: boolean;
  onClick: () => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({ time, isBooked, onClick }) => {
  return (
    <Button
      onClick={onClick}
      disabled={isBooked}
      className={cn(
        "w-24 h-14 border-2 font-bold text-lg transition-all",
        isBooked 
          ? "bg-hazard-black border-gray-600 text-gray-600 cursor-not-allowed" 
          : "bg-hazard-black border-hazard-yellow text-hazard-yellow hover:bg-hazard-yellow hover:text-hazard-black"
      )}
    >
      {time}
    </Button>
  );
};

export default TimeSlotButton;