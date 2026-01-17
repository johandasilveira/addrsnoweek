
export type MealType = 'Midi' | 'Soir';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface MealSlot {
  id: string;
  date: string;
  dayName: string;
  type: MealType;
  isRestaurant: boolean;
  recipeName: string;
  notes?: string;
  cooks: string[];
  ingredients: Ingredient[];
}

export interface ShoppingItem {
  name: string;
  unit: string;
  totalQuantity: number;
}
