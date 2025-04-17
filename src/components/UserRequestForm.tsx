import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface UserRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  time: string;
  questName: string;
  date: Date;
  onSubmit?: (data: UserRequestData) => void;
}

export interface UserRequestData {
  name: string;
  phone: string;
  time: string;
  questName: string;
  timestamp: number;
  date?: string;
}

const UserRequestForm: React.FC<UserRequestFormProps> = ({ 
  isOpen, 
  onClose, 
  time, 
  questName, 
  date,
  onSubmit 
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestData: UserRequestData = {
      name,
      phone,
      time,
      questName,
      timestamp: Date.now(),
      date: format(date, 'yyyy-MM-dd')
    };
    
    // Сохраняем данные в localStorage
    const existingRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    localStorage.setItem('userRequests', JSON.stringify([...existingRequests, requestData]));
    
    if (onSubmit) {
      onSubmit(requestData);
    }
    
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    onClose();
  };

  const formattedDate = format(date, 'dd MMMM yyyy', { locale: ru });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-hazard-black border-2 border-hazard-orange text-hazard-yellow sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-hazard-orange">
            Запрос на бронирование
          </DialogTitle>
          <DialogDescription className="text-hazard-yellow opacity-70">
            {questName} — {formattedDate} в {time}
          </DialogDescription>
        </DialogHeader>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-hazard-yellow">Ваше имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black text-hazard-yellow border-hazard-yellow"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-hazard-yellow">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-black text-hazard-yellow border-hazard-yellow"
                required
                placeholder="+7 (___) ___-__-__"
              />
            </div>

            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-hazard-orange text-hazard-black hover:bg-orange-600"
              >
                Отправить заявку
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center p-4 border-2 border-hazard-orange rounded-lg">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
              <p className="text-hazard-yellow opacity-80">
                Скоро с вами свяжется администратор для подтверждения бронирования.
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

export default UserRequestForm;