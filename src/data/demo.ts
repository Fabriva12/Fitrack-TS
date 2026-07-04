import type { DaySession, WeeklyRoutine, User, Instructor } from "../Types";

let _id = -1;
function nextId(): number { return _id++; }

export const DEMO_USER: User = {
  id: 1,
  name: "Ana García",
  age: 28,
  email: "ana.garcia@email.com",
  experienceLevel: "intermediate",
  routineId: null,
};

export const DEMO_ROUTINE: DaySession[] = [
  {
    id: nextId(),
    day: "Lunes",
    exercises: [
      { id: nextId(), category: "cardio", name: "Running", duration: 30, completed: false, origin: 'local', caloriesBurned: 280 },
      { id: nextId(), category: "strength", name: "Bench Press", duration: 20, completed: false, origin: 'local', weight: 60 },
    ],
  },
  {
    id: nextId(),
    day: "Miércoles",
    exercises: [
      { id: nextId(), category: "cardio", name: "Cycling", duration: 45, completed: false, origin: 'local', caloriesBurned: 360 },
      { id: nextId(), category: "strength", name: "Squat", duration: 25, completed: false, origin: 'local', weight: 80 },
    ],
  },
  {
    id: nextId(),
    day: "Viernes",
    exercises: [
      { id: nextId(), category: "flexibility", name: "Yoga", duration: 40, completed: false, origin: 'local', comments: "Rutina de estiramientos profundos" },
      { id: nextId(), category: "strength", name: "Deadlift", duration: 20, completed: false, origin: 'local', weight: 100 },
      { id: nextId(), category: "flexibility", name: "Pilates", duration: 30, completed: false, origin: 'local', comments: "Enfoque en core y postura" },
    ],
  },
];

function buildAnaSessions(): DaySession[] {
  return [
    {
      id: nextId(),
      day: "Lunes",
      exercises: [
        { id: nextId(), category: "cardio", name: "Running", duration: 30, completed: true, origin: 'local', caloriesBurned: 280 },
        { id: nextId(), category: "strength", name: "Bench Press", duration: 20, completed: true, origin: 'local', weight: 60 },
      ],
    },
    {
      id: nextId(),
      day: "Miércoles",
      exercises: [
        { id: nextId(), category: "cardio", name: "Cycling", duration: 45, completed: false, origin: 'local', caloriesBurned: 360 },
        { id: nextId(), category: "strength", name: "Squat", duration: 25, completed: false, origin: 'local', weight: 80 },
      ],
    },
    {
      id: nextId(),
      day: "Viernes",
      exercises: [
        { id: nextId(), category: "flexibility", name: "Yoga", duration: 40, completed: false, origin: 'local', comments: "Rutina de estiramientos profundos" },
        { id: nextId(), category: "strength", name: "Deadlift", duration: 20, completed: false, origin: 'local', weight: 100 },
        { id: nextId(), category: "flexibility", name: "Pilates", duration: 30, completed: false, origin: 'local', comments: "Enfoque en core y postura" },
      ],
    },
  ];
}

function buildPedroSessions(): DaySession[] {
  return [
    {
      id: nextId(),
      day: "Lunes",
      exercises: [
        { id: nextId(), category: "strength", name: "Bench Press", duration: 30, completed: true, origin: 'local', weight: 100 },
        { id: nextId(), category: "strength", name: "Rows", duration: 25, completed: true, origin: 'local', weight: 70 },
        { id: nextId(), category: "cardio", name: "HIIT", duration: 20, completed: true, origin: 'local', caloriesBurned: 350 },
      ],
    },
    {
      id: nextId(),
      day: "Martes",
      exercises: [
        { id: nextId(), category: "strength", name: "Squat", duration: 30, completed: true, origin: 'local', weight: 120 },
        { id: nextId(), category: "strength", name: "Deadlift", duration: 25, completed: true, origin: 'local', weight: 140 },
      ],
    },
    {
      id: nextId(),
      day: "Miércoles",
      exercises: [
        { id: nextId(), category: "cardio", name: "Running", duration: 45, completed: true, origin: 'local', caloriesBurned: 420 },
        { id: nextId(), category: "flexibility", name: "Yoga", duration: 30, completed: false, origin: 'local', comments: "Recuperación activa" },
      ],
    },
    {
      id: nextId(),
      day: "Jueves",
      exercises: [
        { id: nextId(), category: "strength", name: "Shoulder Press", duration: 25, completed: true, origin: 'local', weight: 50 },
        { id: nextId(), category: "strength", name: "Pull-ups", duration: 20, completed: true, origin: 'local', weight: 85 },
        { id: nextId(), category: "cardio", name: "Rowing", duration: 25, completed: true, origin: 'local', caloriesBurned: 200 },
      ],
    },
    {
      id: nextId(),
      day: "Viernes",
      exercises: [
        { id: nextId(), category: "cardio", name: "Swimming", duration: 40, completed: false, origin: 'local', caloriesBurned: 400 },
      ],
    },
    {
      id: nextId(),
      day: "Sábado",
      exercises: [
        { id: nextId(), category: "flexibility", name: "Pilates", duration: 45, completed: false, origin: 'local', comments: "Core y movilidad" },
        { id: nextId(), category: "cardio", name: "Cycling", duration: 60, completed: false, origin: 'local', caloriesBurned: 480 },
      ],
    },
  ];
}

function buildLuciaSessions(): DaySession[] {
  return [
    {
      id: nextId(),
      day: "Martes",
      exercises: [
        { id: nextId(), category: "cardio", name: "Walking", duration: 30, completed: true, origin: 'local', caloriesBurned: 120 },
      ],
    },
    {
      id: nextId(),
      day: "Jueves",
      exercises: [
        { id: nextId(), category: "strength", name: "Bicep Curls", duration: 15, completed: false, origin: 'local', weight: 8 },
        { id: nextId(), category: "flexibility", name: "Stretching", duration: 20, completed: false, origin: 'local', comments: "Estiramientos suaves" },
      ],
    },
  ];
}

export function getDemoInstructorData(): {
  instructor: Instructor;
  users: User[];
  routines: WeeklyRoutine[];
  sessions: DaySession[];
} {
  const instructor: Instructor = {
    id: 10,
    name: "Carlos Ruiz",
    age: 35,
    email: "carlos.ruiz@fitrack.com",
    assignedUsers: [1, 2, 3],
  };

  const anaSessions = buildAnaSessions();
  const pedroSessions = buildPedroSessions();
  const luciaSessions = buildLuciaSessions();

  const allSessions = [...anaSessions, ...pedroSessions, ...luciaSessions];

  const anaRoutine: WeeklyRoutine = {
    id: 100,
    name: "Mi rutina semanal",
    startDate: "2026-05-25",
    sessionIds: anaSessions.map(s => s.id),
  };

  const pedroRoutine: WeeklyRoutine = {
    id: 200,
    name: "Rutina intensiva",
    startDate: "2026-05-25",
    sessionIds: pedroSessions.map(s => s.id),
  };

  const luciaRoutine: WeeklyRoutine = {
    id: 300,
    name: "Empezando",
    startDate: "2026-05-25",
    sessionIds: luciaSessions.map(s => s.id),
  };

  const users: User[] = [
    {
      id: 1,
      name: "Ana García",
      age: 28,
      email: "ana.garcia@email.com",
      experienceLevel: "intermediate",
      routineId: anaRoutine.id,
    },
    {
      id: 2,
      name: "Pedro López",
      age: 32,
      email: "pedro.lopez@email.com",
      experienceLevel: "advanced",
      routineId: pedroRoutine.id,
    },
    {
      id: 3,
      name: "Lucía Martínez",
      age: 24,
      email: "lucia.martinez@email.com",
      experienceLevel: "beginner",
      routineId: luciaRoutine.id,
    },
  ];

  return { instructor, users, routines: [anaRoutine, pedroRoutine, luciaRoutine], sessions: allSessions };
}
