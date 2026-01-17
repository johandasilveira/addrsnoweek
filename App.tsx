
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_SLOTS, PARTICIPANTS } from './constants';
import { MealSlot, ShoppingItem, Ingredient } from './types';
import MealPlanner from './components/MealPlanner';
import ShoppingSummary from './components/ShoppingSummary';
import { Calendar, ShoppingCart, Utensils } from 'lucide-react';

const App: React.FC = () => {
  const [slots, setSlots] = useState<MealSlot[]>(() => {
    const saved = localStorage.getItem('snoweek_planner');
    return saved ? JSON.parse(saved) : INITIAL_SLOTS;
  });
  const [activeTab, setActiveTab] = useState<'planner' | 'shopping'>('planner');

  useEffect(() => {
    localStorage.setItem('snoweek_planner', JSON.stringify(slots));
  }, [slots]);

  const updateSlot = (updatedSlot: MealSlot) => {
    setSlots(prev => prev.map(s => s.id === updatedSlot.id ? updatedSlot : s));
  };

  const shoppingList = useMemo(() => {
    const aggregate: Record<string, ShoppingItem> = {};

    slots.forEach(slot => {
      if (!slot.isRestaurant) {
        slot.ingredients.forEach(ing => {
          const key = `${ing.name.trim().toLowerCase()}-${ing.unit.toLowerCase()}`;
          if (aggregate[key]) {
            aggregate[key].totalQuantity += Number(ing.quantity);
          } else {
            aggregate[key] = {
              name: ing.name.trim(),
              unit: ing.unit,
              totalQuantity: Number(ing.quantity)
            };
          }
        });
      }
    });

    return Object.values(aggregate).sort((a, b) => a.name.localeCompare(b.name));
  }, [slots]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header - Plus compact */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Utensils size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-blue-900 leading-tight">ADDR SNOWEEK</h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Janvier 2026 • 13 Pers.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full">
            <UserGroup size={14} />
            <span>{PARTICIPANTS.length} Participants</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 pt-4">
        {activeTab === 'planner' ? (
          <MealPlanner slots={slots} onUpdateSlot={updateSlot} />
        ) : (
          <ShoppingSummary items={shoppingList} />
        )}
      </main>

      {/* Navigation Persistante - Plus compacte */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-3 py-2.5 z-40 flex justify-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1.5 max-w-xs w-full">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'planner' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calendar size={16} />
            Planning
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'shopping' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingCart size={16} />
            Courses
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;

const UserGroup: React.FC<{size?: number}> = ({size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
