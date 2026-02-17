
import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle2, PackagePlus, AlertCircle, RefreshCcw } from 'lucide-react';
import { scanInvoice } from '../services/geminiService';
import { useInventory } from '../context/InventoryContext';

const InvoicesView = () => {
  const { stock, updateStock } = useInventory();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setResult(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const extractedItems = await scanInvoice(base64);
        setResult(extractedItems || []);
      } catch (err) {
        console.error("Error procesando factura:", err);
        setResult([]);
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!result) return;
    
    result.forEach(item => {
      // Búsqueda segura con comprobación de nulidad
      if (!item.name) return;

      const matched = stock.find(s => {
        const stockName = (s.name || "").toLowerCase();
        const invoiceName = (item.name || "").toLowerCase();
        return stockName.includes(invoiceName) || invoiceName.includes(stockName);
      });
      
      if (matched) {
        updateStock(matched.id, item.quantity);
      }
    });

    setSuccess(true);
    setTimeout(() => {
        setResult(null);
        setSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-20">
      {!result && !success && (
        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-[#f8f7f2] rounded-3xl flex items-center justify-center mb-8 border border-gray-50 shadow-inner rotate-3">
            <Camera size={40} className="text-[#6b7336]" />
          </div>
          <h2 className="text-xl font-black text-gray-800 mb-3 uppercase tracking-tight">Capturar Factura</h2>
          <p className="text-xs text-gray-400 mb-10 max-w-[220px] leading-relaxed font-medium">
            Sube una foto y deja que la IA procese el ingreso automático a tu inventario.
          </p>

          <label className="w-full">
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
              disabled={scanning}
            />
            <div className={`flex items-center justify-center gap-3 w-full py-5 bg-[#6b7336] text-white rounded-[2rem] font-black transition-all active:scale-95 shadow-xl shadow-olive-100/40 ${scanning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              {scanning ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
              {scanning ? 'PROCESANDO CON IA...' : 'SUBIR FACTURA'}
            </div>
          </label>
        </div>
      )}

      {result && !success && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-6 duration-500 shadow-xl">
          <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-[#6b7336] font-black uppercase text-[10px] tracking-widest">
                <PackagePlus size={16} />
                <span>Resultados del Análisis</span>
              </div>
              <button onClick={() => setResult(null)} className="text-gray-300"><RefreshCcw size={16}/></button>
          </div>
          
          <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
            {result.length > 0 ? result.map((item, idx) => {
              const matched = stock.find(s => {
                const sName = (s.name || "").toLowerCase();
                const iName = (item.name || "").toLowerCase();
                return sName.includes(iName) || iName.includes(sName);
              });

              return (
                <div key={idx} className="flex justify-between items-center py-4 px-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex-1">
                    <span className="font-black text-gray-800 text-sm block leading-tight">{item.name || "Sin nombre"}</span>
                    <span className={`text-[9px] font-black uppercase mt-1 inline-block px-1.5 py-0.5 rounded ${matched ? 'text-[#6b7336] bg-olive-50' : 'text-orange-400 bg-orange-50'}`}>
                        {matched ? 'Existente' : 'Nuevo Producto'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#6b7336]">+{item.quantity || 0}</span>
                    <span className="block text-[10px] text-gray-400 font-bold">${item.price || 0} c/u</span>
                  </div>
                </div>
              );
            }) : (
              <div className="flex items-center gap-3 text-orange-400 p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <AlertCircle size={24} />
                <p className="text-xs font-bold leading-tight">No pudimos extraer datos legibles. Por favor, intenta con una foto más clara.</p>
              </div>
            )}
          </div>
          
          {result.length > 0 && (
            <div className="pt-8 space-y-3">
                <button 
                onClick={handleConfirm}
                className="w-full py-5 bg-black text-white rounded-[1.8rem] font-black shadow-2xl active:scale-95 transition-all text-xs tracking-widest"
                >
                CONFIRMAR E INGRESAR STOCK
                </button>
                <p className="text-[10px] text-gray-300 text-center font-bold uppercase tracking-tighter">
                    Solo se actualizarán los productos "Existentes"
                </p>
            </div>
          )}
        </div>
      )}

      {success && (
        <div className="bg-white p-12 rounded-[3rem] border border-gray-100 text-center animate-in zoom-in duration-500 shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
                <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-gray-800 font-black text-xl mb-2 uppercase">Stock Sincronizado</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Factura guardada correctamente</p>
        </div>
      )}
    </div>
  );
};

export default InvoicesView;
