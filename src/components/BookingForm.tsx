import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  time: string;
  questName: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ isOpen, onClose, time, questName }) => {
  const [name, setName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [prepayment, setPrepayment] = useState('');
  const [additionalServices, setAdditionalServices] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Логика для сохранения бронирования
    console.log({
      name,
      totalAmount,
      prepayment,
      additionalServices,
      time,
      questName
    });
    
    onClose();
    alert(`Квест "${questName}" успешно забронирован на ${time}!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-hazard-black border-2 border-hazard-yellow text-hazard-yellow sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-hazard-yellow">
            Бронирование квеста "{questName}" на {time}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-hazard-yellow">ФИО клиента</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black text-hazard-yellow border-hazard-yellow"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalAmount" className="text-hazard-yellow">Сумма бронирования (₽)</Label>
            <Input
              id="totalAmount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="bg-black text-hazard-yellow border-hazard-yellow"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prepayment" className="text-hazard-yellow">Сумма предоплаты (₽)</Label>
            <Input
              id="prepayment"
              type="number"
              value={prepayment}
              onChange={(e) => setPrepayment(e.target.value)}
              className="bg-black text-hazard-yellow border-hazard-yellow"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="additionalServices" 
              checked={additionalServices}
              onCheckedChange={(checked) => setAdditionalServices(checked as boolean)}
              className="border-hazard-yellow data-[state=checked]:bg-hazard-yellow data-[state=checked]:text-hazard-black"
            />
            <Label 
              htmlFor="additionalServices" 
              className="text-hazard-yellow"
            >
              Дополнительные услуги
            </Label>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-hazard-yellow text-hazard-black hover:bg-yellow-600"
            >
              Подтвердить бронирование
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;