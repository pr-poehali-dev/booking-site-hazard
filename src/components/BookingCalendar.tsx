import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isToday, addMonths, isAfter, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';

interface BookingCalendarProps {
  onSelectDate: (date: Date) => void;
  bookedDates?: {date: string; times: string[]}[];
  selectedDate: Date | null;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  onSelectDate, 
  bookedDates = [], 
  selectedDate 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  useEffect(() => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
    setCalendarDays(daysInMonth);
  }, [currentMonth]);

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    const prevMonthDate = addMonths(currentMonth, -1);
    // Нельзя переключиться на месяц раньше текущего
    if (isAfter(endOfMonth(prevMonthDate), new Date())) {
      setCurrentMonth(prevMonthDate);
    }
  };

  // Проверяем, есть ли бронирования на дату
  const getBookingsCountForDay = (day: Date) => {
    const formatted = format(day, 'yyyy-MM-dd');
    const dayBookings = bookedDates.find(booking => booking.date === formatted);
    return dayBookings ? dayBookings.times.length : 0;
  };

  // Проверяем, полностью ли забронирован день (все слоты заняты)
  const isFullyBooked = (day: Date) => {
    // Предполагаем, что максимум 8 слотов в день
    return getBookingsCountForDay(day) >= 8;
  };

  return (
    <Card className="p-4 bg-hazard-black border-2 border-hazard-orange">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-hazard-orange">
          {format(currentMonth, 'LLLL yyyy', { locale: ru })}
        </h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevMonth}
            className="border-hazard-orange text-hazard-orange hover:bg-hazard-orange hover:text-hazard-black"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextMonth}
            className="border-hazard-orange text-hazard-orange hover:bg-hazard-orange hover:text-hazard-black"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="text-center text-sm text-hazard-yellow font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Пустые ячейки для выравнивания календаря */}
        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() || 7 }).map((_, i) => (
          <div key={`empty-start-${i}`} className="h-10 rounded-md"></div>
        ))}

        {calendarDays.map((day) => {
          const isPast = isBefore(day, new Date()) && !isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const bookingsCount = getBookingsCountForDay(day);
          const fullyBooked = isFullyBooked(day);
          
          // Определить стиль для ячейки календаря
          let cellStyle = "h-10 flex items-center justify-center rounded-md cursor-pointer";
          if (isPast) {
            cellStyle += " opacity-30 cursor-not-allowed bg-gray-800 text-gray-500";
          } else if (isSelected) {
            cellStyle += " bg-hazard-orange text-hazard-black font-bold";
          } else if (fullyBooked) {
            cellStyle += " bg-red-900/20 text-hazard-yellow border border-red-600";
          } else if (bookingsCount > 0) {
            cellStyle += " bg-amber-700/20 text-hazard-yellow border border-hazard-orange";
          } else {
            cellStyle += " hover:bg-hazard-orange/20 text-hazard-yellow border border-hazard-orange/50";
          }
          
          if (isToday(day)) {
            cellStyle += " ring-2 ring-hazard-orange";
          }

          return (
            <div 
              key={day.toString()}
              className={cellStyle}
              onClick={() => !isPast && onSelectDate(day)}
            >
              <span>{format(day, 'd')}</span>
              
              {/* Индикатор количества бронирований */}
              {bookingsCount > 0 && !isPast && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center h-3 w-3 text-[8px] bg-hazard-orange text-black rounded-full">
                  {bookingsCount}
                </span>
              )}
              
              {/* Индикатор полностью забронированного дня */}
              {fullyBooked && !isPast && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[2px] bg-red-600 rotate-45 transform origin-center"></div>
                  <div className="w-full h-[2px] bg-red-600 -rotate-45 transform origin-center"></div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Пустые ячейки в конце */}
        {Array.from({ length: (7 - ((calendarDays.length + (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() || 7)) % 7)) % 7 }).map((_, i) => (
          <div key={`empty-end-${i}`} className="h-10 rounded-md"></div>
        ))}
      </div>
    </Card>
  );
};

export default BookingCalendar;