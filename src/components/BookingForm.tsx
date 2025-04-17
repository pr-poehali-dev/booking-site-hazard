import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  time: string;
  questName: string;
  date?: Date;
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, time, questName, date = new Date() }) => {
  const [playerName, setPlayerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [prepayment, setPrepayment] = useState('');
  const [additionalServices, setAdditionalServices] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь бы отправлялись данные на сервер
    console.log({
      playerName,
      totalAmount,
      prepayment,
      additionalServices,
      time,
      date: format(date, 'yyyy-MM-dd'),
      questName
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setPlayerName('');
    setTotalAmount('');
    setPrepayment('');
    setAdditionalServices(false);
    onClose();
  };

  const formattedDate = format(date, 'dd MMMM yyyy', { locale: ru });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-hazard-black border-2 border-hazard-orange text-hazard-yellow sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-hazard-orange">
            Оформление брони
          </DialogTitle>
          <DialogDescription className="text-hazard-yellow opacity-70">
            {questName} — {formattedDate} в {time}
          </DialogDescription>
        </DialogHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-hazard-yellow">Имя клиента</Label>
              <Input
                id="name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="bg-black text-hazard-yellow border-hazard-yellow"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total" className="text-hazard-yellow">Общая сумма</Label>
                <Input
                  id="total"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="bg-black text-hazard-yellow border-hazard-yellow"
                  type="number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prepayment" className="text-hazard-yellow">Предоплата</Label>
                <Input
                  id="prepayment"
                  value={prepayment}
                  onChange={(e) => setPrepayment(e.target.value)}
                  className="bg-black text-hazard-yellow border-hazard-yellow"
                  type="number"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="services" 
                checked={additionalServices}
                onCheckedChange={(checked) => setAdditionalServices(checked === true)}
                className="border-hazard-yellow data-[state=checked]:bg-hazard-orange data-[state=checked]:border-hazard-orange"
              />
              <Label htmlFor="services" className="text-hazard-yellow">Дополнительные услуги</Label>
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-hazard-orange text-hazard-black hover:bg-orange-600"
              >
                Забронировать
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center p-4 border-2 border-hazard-orange rounded-lg">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Бронирование создано!</h3>
              <p className="text-hazard-yellow opacity-80">
                {playerName} — {formattedDate} в {time}
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleClose} 
                className="bg-hazard-orange text-hazard-black hover:bg-orange-600"
              >
                Закрыть
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;