
import React, { useState } from 'react';
import { Plus, Trash2, Calendar, X, Save, AlertTriangle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const WasteView = () => {
  const { waste, stock, addWaste } = useInventory();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    stockId: '',
    quantity: 1,
    reason: 'SPOILED' as 'SPOILED' | 'EXPIRED' | 'OTHER'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = stock.find(s => s.id === formData.stockId);
    if (!item) return;

    addWaste({
      name: item.name,
      reason: formData.reason,
      date: new Date().toISOString().split('T')[0],
      cost: item.pricePerUnit * formData.quantity
    }, formData.stockId, formData.quantity);

    setShowModal(false);
    setFormData({ stockId: '', quantity: 1, reason: 'SPOILED' });
  };

  const totalMonthlyLoss = waste.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-800">Mermas</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-black text-[#6b7336] shadow-sm active:scale-95 transition-all"
        >
          <Plus size={16} /> REGISTRAR
        </button>
      </div>

      <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 shadow-sm shadow-red-50/50">
        <div className="flex items-center gap-2 text-red-800 font-black text-[10px] uppercase tracking-widest mb-1">
            <AlertTriangle size={14} /> Impacto Económico
        </div>
        <p className="text-red-600 text-[11px] mb-4 font-medium uppercase tracking-tight">Has perdido <b>${totalMonthlyLoss.toFixed(2)}</b> este periodo por desperdicios.</p>
        <div className="h-2.5 w-full bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(totalMonthlyLoss / 2, 100)}%` }}></div>
        </div>
      </div>

      <div className="space-y-3">
        {waste.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem]">
             <p className="text-gray-400 text-sm font-bold">Sin registros de desperdicio.</p>
          </div>
        ) : (
          waste.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-left duration-300">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 border border-red-100/30">
                 <Trash2 size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-gray-800 text-sm">{item.name}</h4>
                    <div className="flex items-center gap-2 text-[9px] uppercase font-black tracking-widest mt-1">
                      <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded">{item.reason}</span>
                      <span className="text-gray-300 flex items-center gap-1">
                        <Calendar size={10} /> {item.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-red-500 font-black text-sm">
                    -${item.cost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">Registrar Merma</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Producto</label>
                <select 
                  required 
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#6b7336]"
                  value={formData.stockId}
                  onChange={e => setFormData({...formData, stockId: e.target.value})}
                >
                  <option value="">Selecciona un producto...</option>
                  {stock.map(s => <option key={s.id} value={s.id}>{s.name} ({s.units} {s.unitType})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cantidad</label>
                  <input 
                    required 
                    type="number" 
                    step="0.1" 
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-black"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Motivo</label>
                  <select 
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold"
                    value={formData.reason}
                    onChange={e => setFormData({...formData, reason: e.target.value as any})}
                  >
                    <option value="SPOILED">Dañado/Podrido</option>
                    <option value="EXPIRED">Vencido</option>
                    <option value="OTHER">Otro error</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Save size={18}/> GUARDAR REGISTRO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WasteView;
