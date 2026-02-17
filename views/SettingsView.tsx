
import React from 'react';
import { ShieldCheck, Share2, Smartphone, Download, LogOut, Database, RefreshCcw } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const SettingsView = () => {
  const { user, logout, stock, recipes, tasks, waste } = useInventory();

  const handleExportData = () => {
    const data = { 
      stock, 
      recipes, 
      tasks, 
      waste,
      exportedAt: new Date().toISOString(),
      appName: "AYN - All You Need"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ayn_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm("¿Estás seguro? Se borrarán todos los datos locales.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AYN - All You Need',
          text: 'Gestiona tu inventario y escandallos de forma profesional.',
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copiado al portapapeles.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#6b7336]/10 rounded-full flex items-center justify-center text-[#6b7336]">
                <ShieldCheck size={28} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800">{user?.name}</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
        </div>

        <button 
          onClick={handleShareApp}
          className="w-full py-4 bg-[#6b7336] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-olive-100 active:scale-95 transition-all mb-4"
        >
          <Share2 size={20} />
          COMPARTIR ACCESO
        </button>

        <div className="p-4 bg-blue-50 rounded-2xl flex items-start gap-3">
            <Smartphone size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
                <p className="text-[11px] font-bold text-blue-700 uppercase mb-1">Modo App Nativa</p>
                <p className="text-[10px] text-blue-600 leading-tight">
                    Pulsa "Compartir" en el navegador y "Añadir a pantalla de inicio" para usar AYN sin barras de navegación.
                </p>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Gestión de Datos</h3>
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={handleExportData}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-colors"
            >
                <Download size={24} className="text-[#6b7336]" />
                <span className="text-[10px] font-bold text-gray-700 uppercase">Backup JSON</span>
            </button>
            <button 
                onClick={clearData}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 rounded-3xl hover:bg-red-50 transition-colors group"
            >
                <RefreshCcw size={24} className="text-gray-400 group-hover:text-red-500" />
                <span className="text-[10px] font-bold text-gray-700 uppercase">Limpiar Todo</span>
            </button>
        </div>
      </div>

      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 text-red-500 rounded-2xl font-bold active:scale-95 transition-all"
      >
        <LogOut size={20} />
        CERRAR SESIÓN
      </button>
      
      <div className="text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
          All You Need v1.1.0 - Final
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
