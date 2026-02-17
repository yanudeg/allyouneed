
export interface StockItem {
  id: string;
  name: string;
  category: string;
  units: number;
  unitType: string;
  minStock: number;
  pricePerUnit: number;
}

export interface Ingredient {
  stockItemId: string;
  quantity: number;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  price: number;
  category: 'Desayuno' | 'Comida' | 'Panadería';
}

export interface WasteItem {
  id: string;
  name: string;
  reason: 'SPOILED' | 'EXPIRED' | 'OTHER';
  date: string;
  cost: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'KITCHEN' | 'CLEANING' | 'INVENTORY';
  isUrgent: boolean;
  isCompleted: boolean;
}

export interface Insight {
  title: string;
  content: string;
}
