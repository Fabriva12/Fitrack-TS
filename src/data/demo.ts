import type { DayPlan, User } from "../Types";

export const DEMO_USER: User = {
    id: crypto.randomUUID(),
    name: "Ana García",
    age: 28,
    experienceLevel: "intermediate",
    plan: "mensual",
    startDate: "2026-05-01",
    isActive: true,
    routine: null,
};

export const DEMO_ROUTINE: DayPlan[] = [
    {
        day: "Lunes",
        exercises: [
            {
                id: crypto.randomUUID(),
                type: "cardio",
                name: "Running",
                time: 30,
                caloriesBurned: 8,
                distance: 5,
                heartRateZone: "Z3",
                pace: 6,
            },
            {
                id: crypto.randomUUID(),
                type: "strength",
                name: "Bench Press",
                time: 20,
                caloriesBurned: 5,
                sets: 4,
                reps: 10,
                weight: 60,
            },
        ],
    },
    {
        day: "Miércoles",
        exercises: [
            {
                id: crypto.randomUUID(),
                type: "cardio",
                name: "Cycling",
                time: 45,
                caloriesBurned: 6,
                distance: 15,
                heartRateZone: "Z2",
                pace: 3,
            },
            {
                id: crypto.randomUUID(),
                type: "strength",
                name: "Squat",
                time: 25,
                caloriesBurned: 7,
                sets: 4,
                reps: 8,
                weight: 80,
            },
        ],
    },
    {
        day: "Viernes",
        exercises: [
            {
                id: crypto.randomUUID(),
                type: "flexibility",
                name: "Yoga",
                time: 40,
                caloriesBurned: 3,
                poses: 12,
            },
            {
                id: crypto.randomUUID(),
                type: "strength",
                name: "Deadlift",
                time: 20,
                caloriesBurned: 6,
                sets: 3,
                reps: 6,
                weight: 100,
            },
            {
                id: crypto.randomUUID(),
                type: "flexibility",
                name: "Pilates",
                time: 30,
                caloriesBurned: 4,
                poses: 8,
            },
        ],
    },
];
