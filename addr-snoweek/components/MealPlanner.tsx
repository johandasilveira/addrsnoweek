
import React, { useState, useMemo } from 'react';
import { MealSlot } from '../types';
import MealEditModal from './MealEditModal';
import { UtensilsCrossed, ChefHat, Store, ChevronRight, AlertCircle, CheckCircle2, StickyNote } from 'lucide-react';

interface Props {
  slots: MealSlot[];
  onUpdateSlot: (slot: MealSlot) => void;
}

const MealPlanner: React.FC<Props> = ({ slots, onUpdateSlot }) => {
  const [selectedSlot, setSelectedSlot] = useState<MealSlot | null>(null);

  const stats = useMemo(() => {
    return slots.reduce((acc, slot) => {
      if (slot.isRestaurant) {
        acc.restaurant++;
      } else if (slot.recipeName.trim() !== '') {
        acc.planned++;
      } else {
        acc.toFill++;
      }
      return acc;
    }, { planned: 0, restaurant: 0, toFill: 0 });
  }, [slots]);

  const days = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = { name: slot.dayName, items: [] };
    acc[slot.date].items.push(slot);
    return acc;
  }, {} as Record<string, { name: string, items: MealSlot[] }>);

  const handleToggleRestaurant = (e: React.MouseEvent, slot: MealSlot) => {
    e.stopPropagation();
    onUpdateSlot({
      ...slot,
      isRestaurant: !slot.isRestaurant,
      // On garde les données si on veut revenir en arrière, mais le mode resto prend le dessus
    });
  };

  return (
    <div className="space-y-4">
      {/* Tableau de bord compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Tableau de bord</h2>
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
            <CheckCircle2 size={12} />
            <span>{stats.planned} <span className="hidden xs:inline">Cuisinés</span></span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg">
            <Store size={12} />
            <span>{stats.restaurant} <span className="hidden xs:inline">Restos</span></span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stats.toFill > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertCircle size={12} />
            <span>{stats.toFill} <span className="hidden xs:inline">À remplir</span></span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {(Object.values(days) as Array<{ name: string; items: MealSlot[] }>).map((day) => (
          <div key={day.name} className="flex gap-2 sm:gap-4 group/day">
            
            {/* Colonne GAUCHE : Date */}
            <div className="w-10 sm:w-14 shrink-0 flex flex-col items-center justify-start pt-3 border-r border-slate-100 group-last/day:border-r-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter text-center">
                {day.name.split(' ')[0].substring(0, 3)}
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 leading-none">
                {day.name.split(' ')[1]}
              </span>
              <div className="w-px h-full bg-slate-100 mt-2 group-last/day:hidden"></div>
            </div>

            {/* Colonne DROITE : Repas */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 pb-5">
              {day.items.map(slot => (
                <div key={slot.id} className="relative">
                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl transition-all border-2 flex flex-col justify-between min-h-[95px] hover:shadow-md active:scale-[0.98] ${
                      slot.isRestaurant 
                      ? 'bg-slate-50 border-slate-200 text-slate-400 shadow-inner' 
                      : slot.recipeName 
                        ? 'bg-white border-blue-100 shadow-sm' 
                        : 'bg-white border-dashed border-red-50 text-slate-400 hover:border-red-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 w-full">
                      <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${slot.isRestaurant ? 'text-slate-300' : 'text-slate-400'}`}>
                        {slot.type}
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>

                    <div className="flex-1 pr-16">
                      {slot.isRestaurant ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Store size={18} className="shrink-0 text-orange-400" />
                            <span className="font-bold italic text-sm">Sortie Resto</span>
                          </div>
                          {slot.notes && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 italic line-clamp-1">
                              <StickyNote size={10} />
                              <span>{slot.notes}</span>
                            </div>
                          )}
                        </div>
                      ) : slot.recipeName ? (
                        <div>
                          <h4 className="font-bold text-slate-900 text-[15px] leading-tight line-clamp-1 mb-0.5">{slot.recipeName}</h4>
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                            <ChefHat size={12} className="text-blue-500" />
                            <span className="truncate">{slot.cooks.length > 0 ? slot.cooks.join(', ') : 'À définir'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-400/70">
                          <UtensilsCrossed size={18} />
                          <span className="font-medium italic text-sm">À remplir...</span>
                        </div>
                      )}
                    </div>

                    {slot.ingredients.length > 0 && !slot.isRestaurant && (
                      <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] font-black text-blue-400 uppercase tracking-widest">
                        <span>{slot.ingredients.length} Ing.</span>
                      </div>
                    )}
                  </button>

                  {/* Switch "Resto" */}
                  <div className="absolute top-2.5 right-2 z-20 flex flex-col items-center">
                    <button
                      onClick={(e) => handleToggleRestaurant(e, slot)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none shadow-sm ${
                        slot.isRestaurant ? 'bg-orange-500' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-md ${
                          slot.isRestaurant ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`mt-1 text-[8px] font-black uppercase tracking-tighter ${slot.isRestaurant ? 'text-orange-500' : 'text-slate-300'}`}>
                      {slot.isRestaurant ? 'Resto' : 'Maison'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && (
        <MealEditModal 
          slot={selectedSlot} 
          onClose={() => setSelectedSlot(null)} 
          onSave={(updated) => {
            onUpdateSlot(updated);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
};

export default MealPlanner;
