import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeSlotButtonProps {
  time: string;
  isBooked: boolean;
  onClick: () => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({ time, isBooked, onClick }) => {
  return (
    <Button
      variant="outline"
      className={`
        h-16 w-24 rounded-md border-2 font-bold text-lg
        ${isBooked 
          ? 'bg-hazard-black text-gray-500 border-gray-500 cursor-not-allowed' 
          : 'bg-hazard-black text-hazard-yellow border-hazard-orange hover:bg-hazard-orange hover:text-hazard-black'}
      `}
      onClick={onClick}
      disabled={isBooked}
    >
      {time}
    </Button>
  );
};

export default TimeSlotButton;