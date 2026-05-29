import type { ExerciseCategory } from "../Types";

export interface CatalogItem {
    id: string;
    name: string;
    category: ExerciseCategory;
    defaultDuration: number;
    defaultCaloriesBurned?: number;
    defaultWeight?: number;
    defaultComments?: string;
}

export const EXERCISE_CATALOG: CatalogItem[] = [
    { id: "cat-cardio-01", name: "Running", category: "cardio", defaultDuration: 30, defaultCaloriesBurned: 300 },
    { id: "cat-cardio-02", name: "Cycling", category: "cardio", defaultDuration: 45, defaultCaloriesBurned: 360 },
    { id: "cat-cardio-03", name: "Swimming", category: "cardio", defaultDuration: 40, defaultCaloriesBurned: 400 },
    { id: "cat-cardio-04", name: "Jump Rope", category: "cardio", defaultDuration: 15, defaultCaloriesBurned: 200 },
    { id: "cat-cardio-05", name: "Rowing", category: "cardio", defaultDuration: 30, defaultCaloriesBurned: 250 },
    { id: "cat-cardio-06", name: "Walking", category: "cardio", defaultDuration: 45, defaultCaloriesBurned: 180 },
    { id: "cat-cardio-07", name: "HIIT", category: "cardio", defaultDuration: 20, defaultCaloriesBurned: 350 },

    { id: "cat-str-01", name: "Bench Press", category: "strength", defaultDuration: 20, defaultWeight: 60 },
    { id: "cat-str-02", name: "Squat", category: "strength", defaultDuration: 25, defaultWeight: 80 },
    { id: "cat-str-03", name: "Deadlift", category: "strength", defaultDuration: 20, defaultWeight: 100 },
    { id: "cat-str-04", name: "Pull-ups", category: "strength", defaultDuration: 15, defaultWeight: 70 },
    { id: "cat-str-05", name: "Shoulder Press", category: "strength", defaultDuration: 20, defaultWeight: 40 },
    { id: "cat-str-06", name: "Bicep Curls", category: "strength", defaultDuration: 15, defaultWeight: 15 },
    { id: "cat-str-07", name: "Rows", category: "strength", defaultDuration: 20, defaultWeight: 50 },

    { id: "cat-flex-01", name: "Yoga", category: "flexibility", defaultDuration: 40, defaultComments: "Rutina de estiramientos profundos" },
    { id: "cat-flex-02", name: "Pilates", category: "flexibility", defaultDuration: 30, defaultComments: "Enfoque en core y postura" },
    { id: "cat-flex-03", name: "Stretching", category: "flexibility", defaultDuration: 20, defaultComments: "Estiramientos generales" },
    { id: "cat-flex-04", name: "Tai Chi", category: "flexibility", defaultDuration: 35, defaultComments: "Movimientos fluidos y respiración" },
    { id: "cat-flex-05", name: "Foam Rolling", category: "flexibility", defaultDuration: 20, defaultComments: "Liberación miofascial" },
];
