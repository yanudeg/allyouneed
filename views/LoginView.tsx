
import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const LoginView = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  const { login } = useInventory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(pass)) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-8 bg-[#f8f7f2]">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-[#6b7336] text-white flex items-center justify-center font-bold text-3xl shadow-2xl rounded-3xl mx-auto mb-6">
          AYN
        </div>
        <h1 className="text-2xl font-black text-gray-800">ALL YOU NEED</h1>
        <p className="text-gray-400 text-sm mt-2">Gestión Profesional de Inventario</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="password" 
            placeholder="Contraseña de acceso"
            className={`w-full bg-white border-2 ${error ? 'border-red-500' : 'border-gray-100'} rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-[#6b7336] outline-none transition-all`}
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
        </div>
        
        {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">Acceso denegado</p>}

        <button 
          type="submit"
          className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          ENTRAR AL SISTEMA
        </button>
      </form>
      
      <p className="mt-20 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
        Versión 1.0.4 - Cloud Sync Enabled
      </p>
    </div>
  );
};

export default LoginView;
