import React, { useState, useEffect } from 'react';
import TimeSlotButton from './TimeSlotButton';
import BookingForm from './BookingForm';
import UserRequestForm, { UserRequestData } from './UserRequestForm';
import BookingCalendar from './BookingCalendar';
import { useAuth } from '@/context/AuthContext';
import { Card } from './ui/card';
import { format, isSameDay } from 'date-fns';

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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookedDateTimes, setBookedDateTimes] = useState<{date: string; times: string[]}[]>([]);

  // Загружаем запросы пользователей из localStorage
  useEffect(() => {
    const loadUserRequests = () => {
      const savedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
      
      // Фильтруем запросы для текущего квеста
      const filteredRequests = savedRequests.filter(
        (req: UserRequestData) => req.questName === questName
      );
      setUserRequests(filteredRequests);
      
      // Формируем структуру забронированных дат и времени
      const bookings: Record<string, string[]> = {};
      filteredRequests.forEach((req: UserRequestData) => {
        const date = req.date || format(new Date(req.timestamp), 'yyyy-MM-dd');
        if (!bookings[date]) {
          bookings[date] = [];
        }
        if (!bookings[date].includes(req.time)) {
          bookings[date].push(req.time);
        }
      });
      
      // Преобразуем в формат для компонента календаря
      const bookedDates = Object.keys(bookings).map(date => ({
        date,
        times: bookings[date]
      }));
      
      setBookedDateTimes(bookedDates);
    };

    loadUserRequests();
    
    // Обновляем данные при открытии админкой
    if (isAdmin) {
      const interval = setInterval(loadUserRequests, 2000);
      return () => clearInterval(interval);
    }
  }, [questName, isAdmin]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsFormOpen(true);
  };

  // Проверяем, забронировано ли время на выбранную дату
  const isTimeBooked = (time: string) => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dateBookings = bookedDateTimes.find(b => b.date === dateString);
    
    if (dateBookings) {
      return dateBookings.times.includes(time);
    }
    return false;
  };

  // Проверяем, прошло ли время на сегодня
  const isTimePassed = (time: string) => {
    if (!isSameDay(selectedDate, new Date())) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const timeToday = new Date();
    timeToday.setHours(hours, minutes, 0, 0);
    
    return timeToday < new Date();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTime(null);
  };

  const handleUserRequestSubmit = (data: UserRequestData) => {
    // Обновляем список запросов
    const updatedData = {
      ...data,
      date: format(selectedDate, 'yyyy-MM-dd')
    };
    setUserRequests([...userRequests, updatedData]);
    
    // Обновляем забронированное время
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const dateIndex = bookedDateTimes.findIndex(d => d.date === dateStr);
    
    if (dateIndex >= 0) {
      const newBookedDateTimes = [...bookedDateTimes];
      newBookedDateTimes[dateIndex].times.push(data.time);
      setBookedDateTimes(newBookedDateTimes);
    } else {
      setBookedDateTimes([...bookedDateTimes, { date: dateStr, times: [data.time] }]);
    }
  };

  // Фильтруем заявки для выбранной даты
  const filteredRequests = userRequests.filter(req => {
    const reqDate = req.date || format(new Date(req.timestamp), 'yyyy-MM-dd');
    return reqDate === format(selectedDate, 'yyyy-MM-dd');
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-hazard-orange border-b-2 border-hazard-orange pb-2">{questName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BookingCalendar 
            onSelectDate={handleDateSelect} 
            bookedDates={bookedDateTimes}
            selectedDate={selectedDate}
          />
          
          <div className="mt-4 text-hazard-yellow">
            <p className="font-bold text-hazard-orange">Выбранная дата:</p>
            <p>{format(selectedDate, 'dd.MM.yyyy')}</p>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-4 bg-hazard-black border-2 border-hazard-orange">
            <h3 className="text-xl font-semibold text-hazard-orange mb-4">Доступное время</h3>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {timeSlots.map((time) => (
                <TimeSlotButton
                  key={time}
                  time={time}
                  isBooked={isTimeBooked(time)}
                  isPassed={isTimePassed(time)}
                  onClick={() => handleTimeSelect(time)}
                />
              ))}
            </div>
          </Card>
          
          {/* Показываем запросы пользователей только для админа */}
          {isAdmin && filteredRequests.length > 0 && (
            <Card className="mt-6 p-4 bg-hazard-black border-2 border-hazard-orange">
              <h3 className="text-xl font-semibold text-hazard-orange mb-3">
                Заявки на {format(selectedDate, 'dd.MM.yyyy')}:
              </h3>
              <div className="space-y-2">
                {filteredRequests.map((request, index) => (
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
            </Card>
          )}
        </div>
      </div>

      {selectedTime && isAdmin && (
        <BookingForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          time={selectedTime}
          questName={questName}
          date={selectedDate}
        />
      )}

      {selectedTime && !isAdmin && (
        <UserRequestForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          time={selectedTime}
          questName={questName}
          date={selectedDate}
          onSubmit={handleUserRequestSubmit}
        />
      )}
    </div>
  );
};

export default QuestBooking;