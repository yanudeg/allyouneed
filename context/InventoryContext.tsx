
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockItem, Recipe, WasteItem, Task } from '../types';
import { INITIAL_STOCK, INITIAL_RECIPES, INITIAL_WASTE, INITIAL_TASKS } from '../constants';

interface InventoryContextType {
  stock: StockItem[];
  recipes: Recipe[];
  waste: WasteItem[];
  tasks: Task[];
  user: { name: string; role: string } | null;
  login: (pass: string) => boolean;
  logout: () => void;
  processToastSale: (recipeId: string) => void;
  updateStock: (id: string, units: number) => void;
  addStockItem: (item: Omit<StockItem, 'id'>) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  addTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  completeTask: (id: string) => void;
  addWaste: (item: Omit<WasteItem, 'id'>, stockId: string, quantity: number) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stock, setStock] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem('ayn_stock');
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });
  
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('ayn_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [waste, setWaste] = useState<WasteItem[]>(() => {
    const saved = localStorage.getItem('ayn_waste');
    return saved ? JSON.parse(saved) : INITIAL_WASTE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('ayn_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [user, setUser] = useState<{ name: string; role: string } | null>(() => {
    const saved = localStorage.getItem('ayn_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => { localStorage.setItem('ayn_stock', JSON.stringify(stock)); }, [stock]);
  useEffect(() => { localStorage.setItem('ayn_recipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('ayn_waste', JSON.stringify(waste)); }, [waste]);
  useEffect(() => { localStorage.setItem('ayn_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('ayn_user', JSON.stringify(user)); }, [user]);

  const login = (pass: string) => {
    if (pass === '1234') {
      setUser({ name: 'Admin Ayn', role: 'Gerente' });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addStockItem = (newItem: Omit<StockItem, 'id'>) => {
    const item = { ...newItem, id: Math.random().toString(36).substr(2, 9) };
    setStock(prev => [...prev, item]);
  };

  const addRecipe = (newRecipe: Omit<Recipe, 'id'>) => {
    const recipe = { ...newRecipe, id: Math.random().toString(36).substr(2, 9) };
    setRecipes(prev => [...prev, recipe]);
  };

  const updateStock = (id: string, units: number) => {
    setStock(prev => prev.map(item => 
      item.id === id ? { ...item, units: Math.max(0, item.units + units) } : item
    ));
  };

  const addWaste = (item: Omit<WasteItem, 'id'>, stockId: string, quantity: number) => {
    const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setWaste(prev => [newItem, ...prev]);
    updateStock(stockId, -quantity);
  };

  const processToastSale = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    recipe.ingredients.forEach(ing => updateStock(ing.stockItemId, -ing.quantity));
  };

  const addTask = (newTask: Omit<Task, 'id' | 'isCompleted'>) => {
    const task: Task = { ...newTask, id: Math.random().toString(36).substr(2, 9), isCompleted: false };
    setTasks(prev => [task, ...prev]);
  };

  const completeTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <InventoryContext.Provider value={{ 
      stock, recipes, waste, tasks, user, login, logout,
      processToastSale, updateStock, addStockItem, addRecipe, addTask, completeTask, addWaste 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within InventoryProvider');
  return context;
};
