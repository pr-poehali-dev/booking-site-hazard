import React, { useState, useEffect } from 'react';
import TimeSlotButton from './TimeSlotButton';
import BookingForm from './BookingForm';
import UserRequestForm, { UserRequestData } from './UserRequestForm';
import { useAuth } from '@/context/AuthContext';
import { Card } from './ui/card';

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
  const [userRequests, setUserRequests] = useState<UserRequestData[]>([]);

  // Загружаем запросы пользователей из localStorage
  useEffect(() => {
    const loadUserRequests = () => {
      const savedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
      // Фильтруем запросы для текущего квеста
      const filteredRequests = savedRequests.filter(
        (req: UserRequestData) => req.questName === questName
      );
      setUserRequests(filteredRequests);
    };

    loadUserRequests();
    // Обновляем данные при открытии админкой
    if (isAdmin) {
      const interval = setInterval(loadUserRequests, 2000);
      return () => clearInterval(interval);
    }
  }, [questName, isAdmin]);

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

  const handleUserRequestSubmit = (data: UserRequestData) => {
    // Обновляем список запросов
    setUserRequests([...userRequests, data]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-hazard-orange border-b-2 border-hazard-orange pb-2">{questName}</h2>
      
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

      {/* Показываем запросы пользователей только для админа */}
      {isAdmin && userRequests.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-hazard-orange mb-3">Заявки на бронирование:</h3>
          <div className="space-y-2">
            {userRequests.map((request, index) => (
              <div key={index} className="user-request-card">
                <div className="flex flex-wrap justify-between">
                  <div>
                    <p className="font-medium">
                      <span className="text-hazard-orange">Имя:</span> {request.name}
                    </p>
                    <p>
                      <span className="text-hazard-orange">Телефон:</span> {request.phone}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">
                      <span className="text-hazard-orange">Время:</span> {request.time}
                    </p>
                    <p>
                      <span className="text-hazard-orange">Дата заявки:</span> {new Date(request.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
          onSubmit={handleUserRequestSubmit}
        />
      )}
    </div>
  );
};

export default QuestBooking;