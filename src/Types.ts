export interface Exercise {
    name: string;
    time: number;
    caloriesBurned: number;
    distance?: number;
}

export type DayOfWeek = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

export interface DayPlan {
    day: DayOfWeek;
    exercises: Exercise[];
}

export interface WeeklyPlan {
    name: string;
    entries: DayPlan[];
}

export interface User {
    name: string;
    age: number;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    routine: WeeklyPlan | null;
}