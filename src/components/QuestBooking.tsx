import React, { useState } from 'react';
import TimeSlotButton from './TimeSlotButton';
import BookingForm from './BookingForm';
import UserRequestForm from './UserRequestForm';
import { useAuth } from '@/context/AuthContext';

interface BookedSlot {
  time: string;
  name: string;
  totalAmount: number;
  prepayment: number;
  additionalServices: boolean;
}

interface QuestBookingProps {
  questName: string;
}

const timeSlots = ['12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:30'];

const QuestBooking: React.FC<QuestBookingProps> = ({ questName }) => {
  const { isAdmin } = useAuth();
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsFormOpen(true);
  };

  const isTimeBooked = (time: string) => {
    return bookedSlots.some(slot => slot.time === time);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTime(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-hazard-yellow">{questName}</h2>
      
      <div className="flex flex-wrap gap-4 justify-center">
        {timeSlots.map((time) => (
          <TimeSlotButton
            key={time}
            time={time}
            isBooked={isTimeBooked(time)}
            onClick={() => handleTimeSelect(time)}
          />
        ))}
      </div>

      {selectedTime && isAdmin && (
        <BookingForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          time={selectedTime}
          questName={questName}
        />
      )}

      {selectedTime && !isAdmin && (
        <UserRequestForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          time={selectedTime}
          questName={questName}
        />
      )}
    </div>
  );
};

export default QuestBooking;