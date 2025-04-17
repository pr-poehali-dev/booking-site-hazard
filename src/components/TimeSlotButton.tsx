import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TimeSlotButtonProps {
  time: string;
  isBooked: boolean;
  isPassed?: boolean;
  onClick: () => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({ time, isBooked, isPassed = false, onClick }) => {
  const isDisabled = isBooked || isPassed;
  
  let buttonClass = `
    h-16 w-24 rounded-md border-2 font-bold text-lg relative
    ${isPassed 
      ? 'bg-hazard-black text-gray-500 border-gray-500 cursor-not-allowed opacity-50' 
      : isBooked 
        ? 'bg-hazard-black text-gray-400 border-red-600 cursor-not-allowed' 
        : 'bg-hazard-black text-hazard-yellow border-hazard-orange hover:bg-hazard-orange hover:text-hazard-black'}
  `;
  
  return (
    <Button
      variant="outline"
      className={buttonClass}
      onClick={onClick}
      disabled={isDisabled}
    >
      {time}
      
      {/* Красный крест для забронированного времени */}
      {isBooked && !isPassed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[2px] bg-red-600 rotate-45 transform origin-center"></div>
          <div className="w-full h-[2px] bg-red-600 -rotate-45 transform origin-center"></div>
        </div>
      )}
    </Button>
  );
};

export default TimeSlotButton;