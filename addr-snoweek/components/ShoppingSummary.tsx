
import React, { useState } from 'react';
import { ShoppingItem } from '../types';
// Added ShoppingCart to the imports from lucide-react
import { Search, Printer, CheckCircle2, Circle, ShoppingCart } from 'lucide-react';

interface Props {
  items: ShoppingItem[];
}

const ShoppingSummary: React.FC<Props> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleChecked = (name: string, unit: string) => {
    const key = `${name}-${unit}`;
    const newChecked = new Set(checkedItems);
    if (newChecked.has(key)) newChecked.delete(key);
    else newChecked.add(key);
    setCheckedItems(newChecked);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Liste de Courses</h2>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
        >
          <Printer size={14} />
          PDF
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:outline-none font-semibold text-sm text-slate-900 shadow-sm transition-all"
        />
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-lg overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <p className="text-base font-bold italic">Liste vide.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredItems.map((item) => {
              const key = `${item.name}-${item.unit}`;
              const isChecked = checkedItems.has(key);
              return (
                <div 
                  key={key} 
                  className={`flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer ${isChecked ? 'opacity-40' : ''}`}
                  onClick={() => toggleChecked(item.name, item.unit)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-colors ${isChecked ? 'text-green-500' : 'text-slate-200'}`}>
                      {isChecked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </div>
                    <div>
                      <span className={`text-sm font-bold text-slate-800 ${isChecked ? 'line-through decoration-slate-400' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg font-black text-xs transition-all ${isChecked ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                    {item.totalQuantity} <span className="text-[10px] uppercase font-bold ml-0.5">{item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100 flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-0.5">Total</p>
            <h3 className="text-lg font-black">{items.length} Ingrédients</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
             <ShoppingCart size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingSummary;
