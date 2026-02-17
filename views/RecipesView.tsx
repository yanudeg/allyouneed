
import React, { useState } from 'react';
import { ChefHat, ShoppingCart, Info, Plus, X, Save, Trash2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { Ingredient } from '../types';

const RecipesView = () => {
  const { recipes, stock, addRecipe, processToastSale } = useInventory();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    category: 'Desayuno' as const,
    price: 0,
    ingredients: [] as Ingredient[]
  });

  const handleSimulateSale = (id: string) => {
    processToastSale(id);
    alert("Venta simulada. Stock descontado según el escandallo.");
  };

  const addIngredientField = () => {
    if (stock.length === 0) return;
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { stockItemId: stock[0].id, quantity: 1 }]
    });
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...newRecipe.ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setNewRecipe({ ...newRecipe, ingredients: updated });
  };

  const removeIngredient = (index: number) => {
    setNewRecipe({ ...newRecipe, ingredients: newRecipe.ingredients.filter((_, i) => i !== index) });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecipe.ingredients.length === 0) return alert("Añade al menos un ingrediente");
    addRecipe(newRecipe);
    setNewRecipe({ name: '', category: 'Desayuno', price: 0, ingredients: [] });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Escandallos</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#6b7336] text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
        >
          <Plus size={14} /> Nueva Receta
        </button>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#6b7336] uppercase tracking-widest">{recipe.category}</span>
                <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
              </div>
              <div className="text-lg font-bold text-gray-800">${recipe.price.toFixed(2)}</div>
            </div>

            <div className="space-y-2 mb-6">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ingredientes</h4>
              {recipe.ingredients.map((ing, idx) => {
                const item = stock.find(s => s.id === ing.stockItemId);
                return (
                  <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                    <span className="text-gray-600">{item?.name || 'Desconocido'}</span>
                    <span className="font-medium text-gray-800">{ing.quantity} {item?.unitType}</span>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => handleSimulateSale(recipe.id)}
              className="w-full py-3 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ShoppingCart size={18} />
              Simular Venta (Toast)
            </button>
          </div>
        ))}
      </div>

      {/* Modal Crear Receta */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Crear Escandallo</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-50 rounded-full"><X size={20}/></button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Nombre del Plato</label>
                  <input required type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm" 
                    value={newRecipe.name} onChange={e => setNewRecipe({...newRecipe, name: e.target.value})} placeholder="Ej: Avocado Toast"/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Categoría</label>
                  <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm" 
                    value={newRecipe.category} onChange={e => setNewRecipe({...newRecipe, category: e.target.value as any})}>
                    <option value="Desayuno">Desayuno</option>
                    <option value="Comida">Comida</option>
                    <option value="Panadería">Panadería</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">PVP sugerido ($)</label>
                  <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm" 
                    value={newRecipe.price} onChange={e => setNewRecipe({...newRecipe, price: parseFloat(e.target.value)})}/>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Ingredientes del Stock</label>
                  <button type="button" onClick={addIngredientField} className="text-[#6b7336] text-[10px] font-bold uppercase underline">
                    + Añadir ingrediente
                  </button>
                </div>
                
                {newRecipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-xl">
                    <select 
                      className="flex-1 bg-transparent border-none text-xs font-medium"
                      value={ing.stockItemId}
                      onChange={e => updateIngredient(idx, 'stockItemId', e.target.value)}
                    >
                      {stock.map(s => <option key={s.id} value={s.id}>{s.name} ({s.unitType})</option>)}
                    </select>
                    <input 
                      type="number" step="0.01" 
                      className="w-20 bg-white border-none rounded-lg px-2 py-1 text-xs text-center font-bold"
                      value={ing.quantity}
                      onChange={e => updateIngredient(idx, 'quantity', parseFloat(e.target.value))}
                    />
                    <button type="button" onClick={() => removeIngredient(idx)} className="text-red-400 p-1">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-xl">
                GUARDAR ESCANDALLO
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
        <Info className="text-blue-500 shrink-0" size={20} />
        <p className="text-xs text-blue-700 leading-relaxed">
          Carga tus recetas seleccionando ingredientes de tu inventario para automatizar el control de costos.
        </p>
      </div>
    </div>
  );
};

export default RecipesView;
