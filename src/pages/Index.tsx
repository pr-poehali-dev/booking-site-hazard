import React from 'react';
import QuestBooking from '@/components/QuestBooking';

const Index = () => {
  return (
    <div className="min-h-screen hazard-pattern p-4">
      <div className="max-w-5xl mx-auto py-8 relative">
        {/* Фоновая просвечивающаяся надпись */}
        <div className="absolute -left-5 top-10 ghost-text text-9xl font-bold opacity-20 rotate-[-10deg] pointer-events-none z-0" data-text="DANGER">
          DANGER
        </div>
        <div className="absolute right-0 bottom-20 ghost-text text-9xl font-bold opacity-20 rotate-[5deg] pointer-events-none z-0" data-text="ZONE">
          ZONE
        </div>
        
        <div className="relative z-10">
          <header className="bg-hazard-black border-4 border-hazard-yellow rounded-lg p-6 mb-8">
            <h1 className="text-4xl font-bold text-hazard-yellow text-center mb-2">СИСТЕМА БРОНИРОВАНИЯ КВЕСТОВ</h1>
            <p className="text-center text-xl text-hazard-yellow">Выберите время для бронирования</p>
            <div className="flex justify-center mt-2">
              <div className="animate-neon-flicker text-hazard-yellow font-bold text-2xl px-4 py-1 border-2 border-hazard-yellow">
                CHECK_OUT
              </div>
            </div>
          </header>

          <div className="space-y-10">
            <div className="bg-hazard-black border-4 border-hazard-yellow rounded-lg p-6">
              <QuestBooking questName="Опасная зона" />
            </div>
            
            <div className="bg-hazard-black border-4 border-hazard-yellow rounded-lg p-6">
              <QuestBooking questName="В поисках артефакта" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;