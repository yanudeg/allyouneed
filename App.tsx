
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Package, Receipt, Trash2, ListChecks, ChefHat, Settings } from 'lucide-react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import Dashboard from './views/Dashboard';
import StockView from './views/StockView';
import InvoicesView from './views/InvoicesView';
import WasteView from './views/WasteView';
import TasksView from './views/TasksView';
import RecipesView from './views/RecipesView';
import LoginView from './views/LoginView';
import SettingsView from './views/SettingsView';

const Navbar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: Home, label: 'INICIO' },
    { path: '/stock', icon: Package, label: 'STOCK' },
    { path: '/recipes', icon: ChefHat, label: 'RECETAS' },
    { path: '/invoices', icon: Receipt, label: 'FACTURAS' },
    { path: '/waste', icon: Trash2, label: 'MERMAS' },
    { path: '/tasks', icon: ListChecks, label: 'TAREAS' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-1 py-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center flex-1 py-1 transition-all ${
                isActive ? 'text-[#6b7336]' : 'text-gray-300'
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[8px] mt-1 tracking-tighter ${isActive ? 'font-black' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

const Header = () => (
  <header className="sticky top-0 bg-[#f8f7f2]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between z-40">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-[#6b7336] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-olive-200">
        A
      </div>
      <h1 className="text-sm font-black tracking-widest text-gray-800 uppercase">All You Need</h1>
    </div>
    <Link to="/settings" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
      <Settings size={20} />
    </Link>
  </header>
);

const AppContent = () => {
  const { user } = useInventory();

  if (!user) return <LoginView />;

  return (
    <Router>
      <div className="min-h-screen pb-24 flex flex-col max-w-md mx-auto bg-[#f8f7f2]">
        <Header />
        <main className="flex-1 px-4 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<StockView />} />
            <Route path="/recipes" element={<RecipesView />} />
            <Route path="/invoices" element={<InvoicesView />} />
            <Route path="/waste" element={<WasteView />} />
            <Route path="/tasks" element={<TasksView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </Router>
  );
};

function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}

export default App;
