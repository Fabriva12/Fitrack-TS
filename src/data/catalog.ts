import type { ExerciseCategory } from "../Types";

export interface CatalogItem {
  id: number;
  name: string;
  category: ExerciseCategory;
  defaultDuration: number;
  defaultCaloriesBurned?: number;
  defaultWeight?: number;
  defaultComments?: string;
}

export const EXERCISE_CATALOG: CatalogItem[] = [
  { id: 1, name: "Running", category: "cardio", defaultDuration: 30, defaultCaloriesBurned: 300 },
  { id: 2, name: "Cycling", category: "cardio", defaultDuration: 45, defaultCaloriesBurned: 360 },
  { id: 3, name: "Swimming", category: "cardio", defaultDuration: 40, defaultCaloriesBurned: 400 },
  { id: 4, name: "Jump Rope", category: "cardio", defaultDuration: 15, defaultCaloriesBurned: 200 },
  { id: 5, name: "Rowing", category: "cardio", defaultDuration: 30, defaultCaloriesBurned: 250 },
  { id: 6, name: "Walking", category: "cardio", defaultDuration: 45, defaultCaloriesBurned: 180 },
  { id: 7, name: "HIIT", category: "cardio", defaultDuration: 20, defaultCaloriesBurned: 350 },

  { id: 8, name: "Bench Press", category: "strength", defaultDuration: 20, defaultWeight: 60 },
  { id: 9, name: "Squat", category: "strength", defaultDuration: 25, defaultWeight: 80 },
  { id: 10, name: "Deadlift", category: "strength", defaultDuration: 20, defaultWeight: 100 },
  { id: 11, name: "Pull-ups", category: "strength", defaultDuration: 15, defaultWeight: 70 },
  { id: 12, name: "Shoulder Press", category: "strength", defaultDuration: 20, defaultWeight: 40 },
  { id: 13, name: "Bicep Curls", category: "strength", defaultDuration: 15, defaultWeight: 15 },
  { id: 14, name: "Rows", category: "strength", defaultDuration: 20, defaultWeight: 50 },

  { id: 15, name: "Yoga", category: "flexibility", defaultDuration: 40, defaultComments: "Rutina de estiramientos profundos" },
  { id: 16, name: "Pilates", category: "flexibility", defaultDuration: 30, defaultComments: "Enfoque en core y postura" },
  { id: 17, name: "Stretching", category: "flexibility", defaultDuration: 20, defaultComments: "Estiramientos generales" },
  { id: 18, name: "Tai Chi", category: "flexibility", defaultDuration: 35, defaultComments: "Movimientos fluidos y respiración" },
  { id: 19, name: "Foam Rolling", category: "flexibility", defaultDuration: 20, defaultComments: "Liberación miofascial" },
];
