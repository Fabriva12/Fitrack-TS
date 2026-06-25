import type { DaySession, User, Instructor } from "../Types";

export const DEMO_USER: User = {
    id: crypto.randomUUID(),
    name: "Ana García",
    age: 28,
    email: "ana.garcia@email.com",
    experienceLevel: "intermediate",
    routine: null,
};

export const DEMO_ROUTINE: DaySession[] = [
    {
        id: crypto.randomUUID(),
        day: "Lunes",
        exercises: [
            {
                id: crypto.randomUUID(),
                category: "cardio",
                name: "Running",
                duration: 30,
                completed: false, origin: 'local', caloriesBurned: 280,
            },
            {
                id: crypto.randomUUID(),
                category: "strength",
                name: "Bench Press",
                duration: 20,
                completed: false, origin: 'local', weight: 60,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        day: "Miércoles",
        exercises: [
            {
                id: crypto.randomUUID(),
                category: "cardio",
                name: "Cycling",
                duration: 45,
                completed: false, origin: 'local', caloriesBurned: 360,
            },
            {
                id: crypto.randomUUID(),
                category: "strength",
                name: "Squat",
                duration: 25,
                completed: false, origin: 'local', weight: 80,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        day: "Viernes",
        exercises: [
            {
                id: crypto.randomUUID(),
                category: "flexibility",
                name: "Yoga",
                duration: 40,
                completed: false, origin: 'local', comments: "Rutina de estiramientos profundos",
            },
            {
                id: crypto.randomUUID(),
                category: "strength",
                name: "Deadlift",
                duration: 20,
                completed: false, origin: 'local', weight: 100,
            },
            {
                id: crypto.randomUUID(),
                category: "flexibility",
                name: "Pilates",
                duration: 30,
                completed: false, origin: 'local', comments: "Enfoque en core y postura",
            },
        ],
    },
];

export function getDemoInstructorData(): { instructor: Instructor; users: User[] } {
    const anaId = crypto.randomUUID();
    const pedroId = crypto.randomUUID();
    const luciaId = crypto.randomUUID();

    const instructor: Instructor = {
        id: crypto.randomUUID(),
        name: "Carlos Ruiz",
        age: 35,
        email: "carlos.ruiz@fitrack.com",
        assignedUsers: [anaId, pedroId, luciaId],
    };

    const users: User[] = [
        {
            id: anaId,
            name: "Ana García",
            age: 28,
            email: "ana.garcia@email.com",
            experienceLevel: "intermediate",
            routine: {
                id: crypto.randomUUID(),
                name: "Mi rutina semanal",
                startDate: "2026-05-25",
                sessions: [
                    {
                        id: crypto.randomUUID(),
                        day: "Lunes",
                        exercises: [
                            { id: crypto.randomUUID(), category: "cardio", name: "Running", duration: 30, completed: true, origin: 'local', caloriesBurned: 280 },
                            { id: crypto.randomUUID(), category: "strength", name: "Bench Press", duration: 20, completed: true, origin: 'local', weight: 60 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Miércoles",
                        exercises: [
                            { id: crypto.randomUUID(), category: "cardio", name: "Cycling", duration: 45, completed: false, origin: 'local', caloriesBurned: 360 },
                            { id: crypto.randomUUID(), category: "strength", name: "Squat", duration: 25, completed: false, origin: 'local', weight: 80 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Viernes",
                        exercises: [
                            { id: crypto.randomUUID(), category: "flexibility", name: "Yoga", duration: 40, completed: false, origin: 'local', comments: "Rutina de estiramientos profundos" },
                            { id: crypto.randomUUID(), category: "strength", name: "Deadlift", duration: 20, completed: false, origin: 'local', weight: 100 },
                            { id: crypto.randomUUID(), category: "flexibility", name: "Pilates", duration: 30, completed: false, origin: 'local', comments: "Enfoque en core y postura" },
                        ],
                    },
                ],
            },
        },
        {
            id: pedroId,
            name: "Pedro López",
            age: 32,
            email: "pedro.lopez@email.com",
            experienceLevel: "advanced",
            routine: {
                id: crypto.randomUUID(),
                name: "Rutina intensiva",
                startDate: "2026-05-25",
                sessions: [
                    {
                        id: crypto.randomUUID(),
                        day: "Lunes",
                        exercises: [
                            { id: crypto.randomUUID(), category: "strength", name: "Bench Press", duration: 30, completed: true, origin: 'local', weight: 100 },
                            { id: crypto.randomUUID(), category: "strength", name: "Rows", duration: 25, completed: true, origin: 'local', weight: 70 },
                            { id: crypto.randomUUID(), category: "cardio", name: "HIIT", duration: 20, completed: true, origin: 'local', caloriesBurned: 350 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Martes",
                        exercises: [
                            { id: crypto.randomUUID(), category: "strength", name: "Squat", duration: 30, completed: true, origin: 'local', weight: 120 },
                            { id: crypto.randomUUID(), category: "strength", name: "Deadlift", duration: 25, completed: true, origin: 'local', weight: 140 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Miércoles",
                        exercises: [
                            { id: crypto.randomUUID(), category: "cardio", name: "Running", duration: 45, completed: true, origin: 'local', caloriesBurned: 420 },
                            { id: crypto.randomUUID(), category: "flexibility", name: "Yoga", duration: 30, completed: false, origin: 'local', comments: "Recuperación activa" },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Jueves",
                        exercises: [
                            { id: crypto.randomUUID(), category: "strength", name: "Shoulder Press", duration: 25, completed: true, origin: 'local', weight: 50 },
                            { id: crypto.randomUUID(), category: "strength", name: "Pull-ups", duration: 20, completed: true, origin: 'local', weight: 85 },
                            { id: crypto.randomUUID(), category: "cardio", name: "Rowing", duration: 25, completed: true, origin: 'local', caloriesBurned: 200 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Viernes",
                        exercises: [
                            { id: crypto.randomUUID(), category: "cardio", name: "Swimming", duration: 40, completed: false, origin: 'local', caloriesBurned: 400 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Sábado",
                        exercises: [
                            { id: crypto.randomUUID(), category: "flexibility", name: "Pilates", duration: 45, completed: false, origin: 'local', comments: "Core y movilidad" },
                            { id: crypto.randomUUID(), category: "cardio", name: "Cycling", duration: 60, completed: false, origin: 'local', caloriesBurned: 480 },
                        ],
                    },
                ],
            },
        },
        {
            id: luciaId,
            name: "Lucía Martínez",
            age: 24,
            email: "lucia.martinez@email.com",
            experienceLevel: "beginner",
            routine: {
                id: crypto.randomUUID(),
                name: "Empezando",
                startDate: "2026-05-25",
                sessions: [
                    {
                        id: crypto.randomUUID(),
                        day: "Martes",
                        exercises: [
                            { id: crypto.randomUUID(), category: "cardio", name: "Walking", duration: 30, completed: true, origin: 'local', caloriesBurned: 120 },
                        ],
                    },
                    {
                        id: crypto.randomUUID(),
                        day: "Jueves",
                        exercises: [
                            { id: crypto.randomUUID(), category: "strength", name: "Bicep Curls", duration: 15, completed: false, origin: 'local', weight: 8 },
                            { id: crypto.randomUUID(), category: "flexibility", name: "Stretching", duration: 20, completed: false, origin: 'local', comments: "Estiramientos suaves" },
                        ],
                    },
                ],
            },
        },
    ];

    return { instructor, users };
}
