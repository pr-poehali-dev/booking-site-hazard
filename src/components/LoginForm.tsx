import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (isAdmin: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // В реальном приложении пароль должен проверяться на сервере
  // Здесь для демонстрации используем простую проверку
  const adminPassword = 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === adminPassword) {
      onLogin(true);
      onClose();
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-hazard-black border-2 border-hazard-yellow text-hazard-yellow sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-hazard-yellow">
            Вход для администратора
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-hazard-yellow">Пароль администратора</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black text-hazard-yellow border-hazard-yellow"
              required
            />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle size={16} />
              <span>Неверный пароль</span>
            </div>
          )}

          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-hazard-yellow text-hazard-black hover:bg-yellow-600"
            >
              Войти
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginForm;