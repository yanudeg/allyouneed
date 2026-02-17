
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Sparkles, ArrowUpRight, Copy, Check, PieChart, Loader2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { getInventoryInsights } from '../services/geminiService';
import { Insight } from '../types';

const Dashboard = () => {
  const { stock, waste } = useInventory();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [copied, setCopied] = useState(false);

  const totalValue = stock.reduce((acc, item) => acc + (item.units * item.pricePerUnit), 0);
  const lowStockCount = stock.filter(item => item.units < item.minStock).length;

  const chartData = [
    { name: 'Veg', value: stock.filter(i => i.category === 'Produce').reduce((a, b) => a + (b.units * b.pricePerUnit), 0) },
    { name: 'Lác', value: stock.filter(i => i.category === 'Dairy').reduce((a, b) => a + (b.units * b.pricePerUnit), 0) },
    { name: 'Pan', value: stock.filter(i => i.category === 'Bakery').reduce((a, b) => a + (b.units * b.pricePerUnit), 0) },
    { name: 'Prot', value: stock.filter(i => i.category === 'Meat').reduce((a, b) => a + (b.units * b.pricePerUnit), 0) },
  ];

  useEffect(() => {
    let mounted = true;
    const fetchInsights = async () => {
      try {
        setLoadingInsights(true);
        const res = await getInventoryInsights(stock, waste);
        if (mounted) {
          setInsights(res);
          setLoadingInsights(false);
        }
      } catch (e) {
        if (mounted) setLoadingInsights(false);
      }
    };
    fetchInsights();
    return () => { mounted = false; };
  }, [stock]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-[#1c1c1c] p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#6b7336]/20 rounded-full blur-3xl"></div>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Dashboard Operativo</span>
            </div>
            <button onClick={copyLink} className="text-white/30 hover:text-white transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
        </div>
        <div>
            <h2 className="text-3xl font-black leading-none mb-1">Activos</h2>
            <div className="text-4xl font-black text-[#d4d99c] tracking-tight">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <p className="text-[11px] text-white/40 mt-3 uppercase tracking-widest font-bold">Valor total de inventario actual</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 group active:scale-95 transition-all">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Riesgos</div>
          <div className={`text-2xl font-black ${lowStockCount > 0 ? 'text-red-500' : 'text-gray-800'}`}>
            {lowStockCount} Items
          </div>
          <div className="text-[9px] text-gray-400 font-bold mt-1 uppercase">Bajo stock crítico</div>
        </div>
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 group active:scale-95 transition-all">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Eficiencia</div>
          <div className="text-2xl font-black text-[#6b7336]">94%</div>
          <div className="flex items-center gap-1 text-[9px] text-green-500 font-bold mt-1 uppercase">
            <ArrowUpRight size={10} /> +1.2% hoy
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-gray-800 text-xs uppercase tracking-widest flex items-center gap-2">
                <PieChart size={16} className="text-[#6b7336]" />
                Distribución por Valor
            </h3>
        </div>
        <div className="h-44 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: '900' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8f7f2' }} 
                  contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }} 
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6b7336' : '#d4d99c'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 italic text-xs">Sin datos disponibles</div>
          )}
        </div>
      </div>

      <div className="bg-[#6b7336] text-white p-7 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mb-10 blur-2xl"></div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sparkles size={18} fill="currentColor" />
          </div>
          <h3 className="font-black text-sm uppercase tracking-[0.2em]">IA Insights</h3>
        </div>

        {loadingInsights ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="animate-spin text-white/40" size={20} />
            <div className="space-y-2 flex-1">
              <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
              <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight, idx) => (
              <div key={idx} className="group border-l-2 border-white/20 pl-4 py-0.5">
                <h4 className="font-black text-[10px] text-[#d4d99c] uppercase mb-1 tracking-widest">{insight.title}</h4>
                <p className="text-white/80 text-xs leading-relaxed font-medium">{insight.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
