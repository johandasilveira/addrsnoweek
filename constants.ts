
import { MealSlot, MealType } from './types';

export const PARTICIPANTS = [
  "Amau", "Ani", "David", "Jojo", "Laure", "Léo", "Lucile", "Nathan", "Paloma", "Ségo", "Solé", "Thib", "Youri"
];

export const UNITS = [
  "unité(s)", "g", "kg", "ml", "cl", "L", "cuillère(s)", "pincée(s)", "paquet(s)", "botte(s)"
];

const RAW_SLOTS: { date: string; dayName: string; type: MealType }[] = [
  { date: '2026-01-24', dayName: 'Samedi 24', type: 'Midi' },
  { date: '2026-01-24', dayName: 'Samedi 24', type: 'Soir' },
  { date: '2026-01-25', dayName: 'Dimanche 25', type: 'Midi' },
  { date: '2026-01-25', dayName: 'Dimanche 25', type: 'Soir' },
  { date: '2026-01-26', dayName: 'Lundi 26', type: 'Midi' },
  { date: '2026-01-26', dayName: 'Lundi 26', type: 'Soir' },
  { date: '2026-01-27', dayName: 'Mardi 27', type: 'Midi' },
  { date: '2026-01-27', dayName: 'Mardi 27', type: 'Soir' },
  { date: '2026-01-28', dayName: 'Mercredi 28', type: 'Midi' },
  { date: '2026-01-28', dayName: 'Mercredi 28', type: 'Soir' },
  { date: '2026-01-29', dayName: 'Jeudi 29', type: 'Midi' },
  { date: '2026-01-29', dayName: 'Jeudi 29', type: 'Soir' },
  { date: '2026-01-30', dayName: 'Vendredi 30', type: 'Midi' },
  { date: '2026-01-30', dayName: 'Vendredi 30', type: 'Soir' },
  { date: '2026-01-31', dayName: 'Samedi 31', type: 'Midi' },
  { date: '2026-01-31', dayName: 'Samedi 31', type: 'Soir' },
  { date: '2026-02-01', dayName: 'Dimanche 01', type: 'Midi' },
];

export const INITIAL_SLOTS: MealSlot[] = RAW_SLOTS.map(slot => ({
  ...slot,
  id: `${slot.date}-${slot.type}`,
  isRestaurant: false,
  recipeName: '',
  notes: '',
  cooks: [],
  ingredients: []
}));
