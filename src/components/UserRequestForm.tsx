import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';

interface UserRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  time: string;
  questName: string;
}

const UserRequestForm: React.FC<UserRequestFormProps> = ({ isOpen, onClose, time, questName }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // В реальном приложении здесь был бы API-запрос для сохранения данных
    console.log({ name, phone, time, questName });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-hazard-black border-2 border-hazard-yellow text-hazard-yellow sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-hazard-yellow">
            Запрос на бронирование
          </DialogTitle>
          <DialogDescription className="text-hazard-yellow opacity-70">
            {questName} — {time}
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
                className="bg-hazard-yellow text-hazard-black hover:bg-yellow-600"
              >
                Отправить заявку
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center p-4 border-2 border-hazard-yellow rounded-lg">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-2">Заявка отправлена!</h3>
              <p className="text-hazard-yellow opacity-80">
                Скоро с вами свяжется администратор для подтверждения бронирования.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleClose} 
                className="bg-hazard-yellow text-hazard-black hover:bg-yellow-600"
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