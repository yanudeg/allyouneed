
import { StockItem, WasteItem, Task, Recipe } from './types';

export const THEME = {
  primary: '#6b7336',
  secondary: '#d4d99c',
  accent: '#facc15',
  background: '#f8f7f2',
  card: '#ffffff',
  dark: '#1c1c1c',
};

export const INITIAL_STOCK: StockItem[] = [
  { id: '1', name: 'Aguacates', category: 'Produce', units: 45, unitType: 'uds', minStock: 20, pricePerUnit: 2.5 },
  { id: '2', name: 'Huevos', category: 'Dairy', units: 120, unitType: 'uds', minStock: 50, pricePerUnit: 0.3 },
  { id: '3', name: 'Pan Sourdough', category: 'Bakery', units: 12, unitType: 'hogazas', minStock: 10, pricePerUnit: 4.5 },
  { id: '4', name: 'Leche Entera', category: 'Dairy', units: 15, unitType: 'litros', minStock: 10, pricePerUnit: 1.2 },
  { id: '5', name: 'Tocino', category: 'Meat', units: 5, unitType: 'kg', minStock: 8, pricePerUnit: 15.0 },
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Avocado Toast Deluxe',
    category: 'Desayuno',
    price: 14.50,
    ingredients: [
      { stockItemId: '1', quantity: 0.5 }, // medio aguacate
      { stockItemId: '3', quantity: 0.1 }, // 1 rebanada (10% de hogaza)
      { stockItemId: '2', quantity: 1 },   // 1 huevo
    ]
  },
  {
    id: 'r2',
    name: 'Huevos con Tocino',
    category: 'Desayuno',
    price: 12.00,
    ingredients: [
      { stockItemId: '2', quantity: 2 },
      { stockItemId: '5', quantity: 0.15 }, // 150g de tocino
    ]
  }
];

export const INITIAL_WASTE: WasteItem[] = [
  { id: 'w1', name: 'Aguacates', reason: 'SPOILED', date: '2024-05-19', cost: 7.50 },
];

export const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Prep Salsa Holandesa', description: 'Hacer 2 litros', category: 'KITCHEN', isUrgent: true, isCompleted: false },
  { id: 't3', title: 'Inventario Semanal', description: 'Conteo completo de barra', category: 'INVENTORY', isUrgent: true, isCompleted: false },
];
