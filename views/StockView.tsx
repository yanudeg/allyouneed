
import React, { useState } from 'react';
import { Plus, ChevronRight, ShoppingBag, X, Save, Search } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const StockView = () => {
  const { stock, addStockItem } = useInventory();
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Produce',
    units: 0,
    unitType: 'uds',
    minStock: 5,
    pricePerUnit: 0
  });

  const categories = ['Todos', 'Produce', 'Dairy', 'Meat', 'Bakery'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addStockItem(newItem);
    setNewItem({ name: '', category: 'Produce', units: 0, unitType: 'uds', minStock: 5, pricePerUnit: 0 });
    setShowAddModal(false);
  };

  const filteredStock = stock.filter(item => {
    const matchesFilter = filter === 'Todos' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 page-transition">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#6b7336] transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Buscar producto..." 
          className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6b7336]/20 shadow-sm transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest transition-all uppercase whitespace-nowrap ${
              filter === cat 
                ? 'bg-[#6b7336] text-white shadow-lg shadow-olive-100/50' 
                : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3 pb-24">
        {filteredStock.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                <Search size={32} />
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Sin resultados</p>
          </div>
        ) : (
          filteredStock.map((item) => {
            const isLow = item.units < item.minStock;
            const suggestedOrder = isLow ? Math.ceil(item.minStock * 1.5 - item.units) : 0;
            
            return (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                     <h4 className="font-black text-gray-800 text-sm">{item.name}</h4>
                     {isLow && (
                       <span className="bg-red-50 text-red-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter animate-pulse">
                         RE-STOCK
                       </span>
                     )}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-tight">
                    {item.units} {item.unitType} <span className="text-gray-200 mx-1">|</span> ${item.pricePerUnit} p/u
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                   {suggestedOrder > 0 && (
                     <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-[#6b7336] uppercase tracking-tighter opacity-60">Pedir</span>
                        <span className="text-sm font-black text-gray-800">+{suggestedOrder}</span>
                     </div>
                   )}
                   <button className="p-3 bg-[#f8f7f2] rounded-2xl text-gray-400 group-hover:bg-[#6b7336]/10 group-hover:text-[#6b7336] transition-colors">
                      <ChevronRight size={18} />
                   </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Ajustado */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom-10 duration-300 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Nuevo Producto</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#6b7336]" 
                  value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} placeholder="Ej: Harina 000"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Categoría</label>
                  <select className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                    {categories.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">U. Medida</label>
                  <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm font-bold" 
                    value={newItem.unitType} onChange={e => setNewItem({...newItem, unitType: e.target.value})} placeholder="kg, litros..."/>
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-[#6b7336] text-white rounded-[2rem] font-black shadow-xl shadow-olive-100/40 flex items-center justify-center gap-2 active:scale-95 transition-all text-xs tracking-widest">
                <Save size={18}/> GUARDAR EN INVENTARIO
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 active:scale-90 transition-all border-4 border-white"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default StockView;
