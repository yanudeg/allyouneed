import React, { useState } from 'react';
import { ChefHat, CheckCircle2, Circle, AlertCircle, Plus, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Task } from '../types';

const TasksView = () => {
  const { tasks, completeTask, addTask } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  // Fix: Explicitly type the category to allow all valid Task categories instead of just 'KITCHEN'
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    category: Task['category'];
    isUrgent: boolean;
  }>({
    title: '',
    description: '',
    category: 'KITCHEN',
    isUrgent: false
  });

  const handleComplete = (id: string) => {
    // Iniciamos una pequeña animación antes de eliminar de la lista
    const element = document.getElementById(`task-${id}`);
    if (element) {
      element.classList.add('scale-95', 'opacity-0', '-translate-x-full');
      setTimeout(() => {
        completeTask(id);
      }, 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask(newTask);
    setNewTask({ title: '', description: '', category: 'KITCHEN', isUrgent: false });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 relative pb-20">
      {/* Header & Stats */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Pendientes</h2>
                <p className="text-xs text-gray-400 mt-0.5">Asigna y completa tareas del día</p>
            </div>
            <div className="w-12 h-12 bg-[#f8f7f2] rounded-2xl flex items-center justify-center text-[#6b7336]">
                <ChefHat size={24} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-olive-50 text-[#6b7336] text-[10px] font-bold rounded-full">
                {tasks.length} TAREAS ACTIVAS
            </span>
        </div>
      </div>

      {/* Add Task Form Overlay/Inline */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl border-2 border-[#6b7336] shadow-xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Nueva Tarea</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="¿Qué hay que hacer?"
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6b7336]"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    required
                />
                <textarea 
                    placeholder="Detalles adicionales..."
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#6b7336] h-20"
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
                <div className="flex gap-2">
                    {(['KITCHEN', 'CLEANING', 'INVENTORY'] as const).map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setNewTask({...newTask, category: cat})}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
                                newTask.category === cat ? 'bg-[#6b7336] text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="rounded text-[#6b7336] focus:ring-[#6b7336]"
                        checked={newTask.isUrgent}
                        onChange={e => setNewTask({...newTask, isUrgent: e.target.checked})}
                    />
                    <span className="text-xs font-bold text-gray-600">Marcar como urgente</span>
                </label>
                <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-all">
                    CREAR TAREA
                </button>
            </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-green-500 shadow-sm border border-gray-50">
                <CheckCircle2 size={32} />
            </div>
            <p className="text-gray-400 text-sm font-medium">¡Todo listo! No hay tareas pendientes.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              id={`task-${task.id}`}
              key={task.id} 
              className="p-5 rounded-[2rem] bg-white border border-gray-50 shadow-sm flex items-center gap-4 transition-all duration-300 ease-out transform"
            >
              <button 
                onClick={() => handleComplete(task.id)}
                className="text-gray-300 hover:text-[#6b7336] transition-colors shrink-0"
              >
                <Circle size={28} strokeWidth={1.5} />
              </button>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm text-gray-800">
                    {task.title}
                  </h4>
                  {task.isUrgent && (
                     <span className="flex items-center gap-1 text-[9px] font-black text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <AlertCircle size={10} /> URGENTE
                     </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                <div className="mt-2 inline-flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-50 rounded text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {task.category}
                    </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      {!showAddForm && (
        <button 
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#6b7336] rounded-full shadow-2xl flex items-center justify-center text-white transform hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Plus size={32} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

export default TasksView;