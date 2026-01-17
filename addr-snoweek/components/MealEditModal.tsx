
import React, { useState } from 'react';
import { MealSlot, Ingredient } from '../types';
import { PARTICIPANTS, UNITS } from '../constants';
import { X, Plus, Trash2, Save, Store, ChefHat, Utensils } from 'lucide-react';

interface Props {
  slot: MealSlot;
  onClose: () => void;
  onSave: (slot: MealSlot) => void;
}

const MealEditModal: React.FC<Props> = ({ slot, onClose, onSave }) => {
  const [recipeName, setRecipeName] = useState(slot.recipeName);
  const [isRestaurant, setIsRestaurant] = useState(slot.isRestaurant);
  const [cooks, setCooks] = useState<string[]>(slot.cooks);
  const [ingredients, setIngredients] = useState<Ingredient[]>(slot.ingredients);

  const addIngredient = () => {
    const newIng: Ingredient = {
      id: crypto.randomUUID(),
      name: '',
      quantity: 1,
      unit: UNITS[0]
    };
    setIngredients([...ingredients, newIng]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(ingredients.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const toggleCook = (name: string) => {
    setCooks(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const handleSave = () => {
    onSave({
      ...slot,
      recipeName: isRestaurant ? '' : recipeName,
      isRestaurant,
      notes: '', 
      cooks: isRestaurant ? [] : cooks,
      ingredients: isRestaurant ? [] : ingredients
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-xl shadow-2xl animate-in slide-in-from-bottom sm:zoom-in duration-300 overflow-hidden">
        
        {/* Header - Plus compact */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">{slot.dayName}</h2>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">{slot.type}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Content Area - Hauteur réduite à 400px pour les petits écrans */}
        <div className="overflow-y-auto p-4 space-y-4 h-[400px] scroll-smooth">
          
          {/* Switch Restaurant - Plus compact */}
          <div className={`flex items-center justify-between px-5 py-3.5 rounded-[1.5rem] border-2 transition-all duration-300 ${isRestaurant ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl transition-all duration-300 ${isRestaurant ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                <Store size={20} />
              </div>
              <div>
                <span className={`text-xs font-black uppercase tracking-tight block ${isRestaurant ? 'text-orange-600' : 'text-slate-800'}`}>
                  Restaurant ?
                </span>
                <span className="text-[10px] font-bold text-slate-400 italic">Pas de courses à faire</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsRestaurant(!isRestaurant)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all ring-4 ring-transparent active:ring-slate-200 ${isRestaurant ? 'bg-orange-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${isRestaurant ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {isRestaurant ? (
            /* Mode RESTO - Centré et compact */
            <div className="flex flex-col items-center justify-center h-[280px] space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <Utensils size={40} strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-orange-600 uppercase tracking-tighter">REPAS RESTO</h3>
                <p className="text-slate-400 font-bold text-xs italic mt-1">On profite, rien à acheter !</p>
              </div>
            </div>
          ) : (
            /* Mode CUISINE MAISON */
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Menu</label>
                <input 
                  type="text" 
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Ex: Raclette..."
                  className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none font-black text-slate-900 text-sm shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <ChefHat size={12} className="text-blue-500" />
                  <span>Cuisiniers</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PARTICIPANTS.map(name => (
                    <button
                      key={name}
                      onClick={() => toggleCook(name)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border-2 ${
                        cooks.includes(name)
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ingrédients</span>
                   <button 
                    onClick={addIngredient}
                    className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-all border border-blue-100"
                  >
                    <Plus size={12} />
                    Ajouter
                  </button>
                </div>

                <div className="space-y-2 pb-2">
                  {ingredients.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                      <p className="text-[11px] font-bold text-slate-300 italic">Aucun ingrédient</p>
                    </div>
                  ) : (
                    ingredients.map((ing) => (
                      <div key={ing.id} className="flex gap-1.5 group animate-in slide-in-from-left-4 duration-200">
                        <input 
                          type="number" 
                          value={ing.quantity}
                          onChange={(e) => updateIngredient(ing.id, 'quantity', e.target.value)}
                          className="w-14 px-1 py-2 bg-slate-50 border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:outline-none font-black text-center text-slate-900 text-xs"
                        />
                        <select
                          value={ing.unit}
                          onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)}
                          className="w-20 px-1 py-2 bg-slate-50 border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-slate-600 text-[9px] appearance-none text-center"
                        >
                          {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <input 
                          type="text" 
                          value={ing.name}
                          onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                          placeholder="Ingrédient..."
                          className="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:outline-none font-bold text-slate-900 text-xs"
                        />
                        <button 
                          onClick={() => removeIngredient(ing.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action - Plus compact */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-xs text-slate-400 hover:bg-slate-50 transition-all"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            className={`flex-[2] py-3 rounded-xl font-black text-xs text-white shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${
              isRestaurant 
              ? 'bg-orange-500 shadow-orange-100' 
              : 'bg-blue-600 shadow-blue-100'
            }`}
          >
            <Save size={16} />
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealEditModal;
