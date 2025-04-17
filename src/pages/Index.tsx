import React, { useState } from 'react';
import QuestBooking from '@/components/QuestBooking';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { KeyRound, LogOut } from 'lucide-react';

const Index = () => {
  const { isAdmin, login, logout } = useAuth();
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

  return (
    <div className="min-h-screen hazard-pattern p-4">
      <div className="container-main mx-auto py-8 relative">
        {/* Фоновая просвечивающаяся надпись */}
        <div className="absolute -left-5 top-10 ghost-text text-8xl font-bold opacity-20 rotate-[-10deg] pointer-events-none z-0" data-text="DANGER">
          DANGER
        </div>
        <div className="absolute right-0 bottom-20 ghost-text text-8xl font-bold opacity-20 rotate-[5deg] pointer-events-none z-0" data-text="ZONE">
          ZONE
        </div>
        
        <div className="relative z-10">
          <header className="bg-hazard-black border-4 border-hazard-orange rounded-lg p-6 mb-8 max-w-5xl mx-auto">
            <div className="flex justify-end mb-4">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="text-hazard-orange">Режим администратора</span>
                  <Button 
                    onClick={logout} 
                    className="bg-hazard-black border-2 border-hazard-orange text-hazard-orange hover:bg-hazard-orange hover:text-hazard-black"
                    size="sm"
                  >
                    <LogOut size={16} className="mr-1" /> Выйти
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsLoginFormOpen(true)} 
                  className="bg-hazard-black border-2 border-hazard-orange text-hazard-orange hover:bg-hazard-orange hover:text-hazard-black"
                  size="sm"
                >
                  <KeyRound size={16} className="mr-1" /> Вход для администратора
                </Button>
              )}
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="animate-neon-flicker text-hazard-orange font-bold text-4xl px-6 py-2 border-4 border-hazard-orange rounded-lg">
                CHECK_OUT.МГН
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-hazard-yellow text-center mb-2">СИСТЕМА БРОНИРОВАНИЯ КВЕСТОВ</h1>
            <p className="text-center text-xl text-hazard-yellow">
              {isAdmin 
                ? "Система администрирования бронирований" 
                : "Выберите время для отправки заявки на бронирование"}
            </p>
          </header>

          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="bg-hazard-black border-4 border-hazard-orange rounded-lg p-6">
              <QuestBooking questName="Опасная зона" />
            </div>
            
            <div className="bg-hazard-black border-4 border-hazard-orange rounded-lg p-6">
              <QuestBooking questName="В поисках артефакта" />
            </div>
          </div>
          
          <footer className="mt-10 text-center text-hazard-yellow max-w-5xl mx-auto">
            <p>© 2023 CHECK_OUT.МГН - Все права защищены</p>
            <p className="text-sm mt-1 text-hazard-orange">support@check-out.мгн</p>
          </footer>
        </div>
      </div>

      <LoginForm
        isOpen={isLoginFormOpen}
        onClose={() => setIsLoginFormOpen(false)}
        onLogin={login}
      />
    </div>
  );
};

export default Index;