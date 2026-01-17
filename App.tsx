
import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_SLOTS, PARTICIPANTS as DEFAULT_PARTICIPANTS } from './constants';
import { MealSlot, ShoppingItem, AppState } from './types';
import MealPlanner from './components/MealPlanner';
import ShoppingSummary from './components/ShoppingSummary';
import ParticipantManager from './components/ParticipantManager';
import { 
  Calendar, 
  ShoppingCart, 
  Utensils, 
  Settings, 
  RotateCcw, 
  X, 
  Users,
  Type,
  CheckCircle2
} from 'lucide-react';

const STORAGE_KEY = 'snoweek_v3_state';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    // Tentative de chargement depuis l'URL (si un hash est présent)
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(hash)));
        if (decoded.slots) {
          window.history.replaceState(null, "", window.location.pathname);
          return decoded;
        }
      } catch (e) { console.error("URL invalide"); }
    }

    // Chargement LocalStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);

    // Valeurs initiales par défaut
    return {
      slots: INITIAL_SLOTS,
      participants: DEFAULT_PARTICIPANTS,
      tripName: 'ADDR SNOWEEK',
      tripSubtitle: 'SÉJOUR JANVIER 2026',
      version: 2
    };
  });

  const [activeTab, setActiveTab] = useState<'planner' | 'shopping'>('planner');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateSlot = (updatedSlot: MealSlot) => {
    setState(prev => ({
      ...prev,
      slots: prev.slots.map(s => s.id === updatedSlot.id ? updatedSlot : s)
    }));
  };

  const updateParticipants = (newParticipants: string[]) => {
    setState(prev => ({ ...prev, participants: newParticipants }));
  };

  const handleReset = () => {
    if (window.confirm("⚠️ Réinitialiser tout le séjour ? Tous les menus et ingrédients seront effacés.")) {
      setState({
        slots: INITIAL_SLOTS,
        participants: DEFAULT_PARTICIPANTS,
        tripName: 'ADDR SNOWEEK',
        tripSubtitle: 'SÉJOUR JANVIER 2026',
        version: Date.now()
      });
      setIsAdminOpen(false);
    }
  };

  const shoppingList = useMemo(() => {
    const aggregate: Record<string, ShoppingItem> = {};
    state.slots.forEach(slot => {
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
  }, [state.slots]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Header Dynamique */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
            <Utensils size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none uppercase">{state.tripName}</h1>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">{state.tripSubtitle}</p>
          </div>
        </div>

        <button 
          onClick={() => setIsAdminOpen(true)}
          className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all border border-slate-100"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-4">
        {activeTab === 'planner' ? (
          <MealPlanner 
            slots={state.slots} 
            participants={state.participants}
            onUpdateSlot={updateSlot} 
          />
        ) : (
          <ShoppingSummary items={shoppingList} />
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-1.5 rounded-[2rem] shadow-2xl flex gap-1.5">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] text-sm font-black transition-all ${
              activeTab === 'planner' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calendar size={18} />
            Planning
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.5rem] text-sm font-black transition-all ${
              activeTab === 'shopping' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ShoppingCart size={18} />
            Courses
          </button>
        </div>
      </nav>

      {/* Admin Panel */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Paramètres</h2>
              <button onClick={() => setIsAdminOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Infos Séjour */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Type size={12} /> Personnalisation
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1">Nom du séjour</label>
                    <input 
                      type="text"
                      value={state.tripName}
                      onChange={(e) => setState(prev => ({ ...prev, tripName: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 ml-1">Sous-titre / Dates</label>
                    <input 
                      type="text"
                      value={state.tripSubtitle}
                      onChange={(e) => setState(prev => ({ ...prev, tripSubtitle: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none font-bold text-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Participants */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Users size={12} /> Participants ({state.participants.length})
                </h3>
                <ParticipantManager 
                  participants={state.participants} 
                  onChange={updateParticipants} 
                />
              </section>

              {/* Nettoyage */}
              <section className="pt-6 border-t border-slate-100 space-y-3">
                <h3 className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Actions</h3>
                <button 
                  onClick={handleReset}
                  className="w-full py-3 bg-red-50 text-red-600 font-black text-xs rounded-xl border border-red-100 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} />
                  Réinitialiser tout le séjour
                </button>
              </section>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 italic">Toutes les modifications sont enregistrées automatiquement sur votre navigateur.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
