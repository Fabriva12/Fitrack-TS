// ─── Cardio ───
// El usuario ingresa estos campos; pace se calcula automáticamente
export interface CardioFormData {
    type: 'cardio';
    name: string;
    time: number;
    caloriesBurned: number;
    distance: number;
    heartRateZone: string;
}

export interface CardioExercise extends CardioFormData {
    pace: number;
}

// ─── Strength ───
export interface StrengthExercise {
    type: 'strength';
    name: string;
    time: number;
    caloriesBurned: number;
    sets: number;
    reps: number;
    weight: number;
}

// ─── Flexibility ───
export interface FlexibilityExercise {
    type: 'flexibility';
    name: string;
    time: number;
    caloriesBurned: number;
    poses: number;
}

// ─── Unión discriminada ───
// Exercise es la unión de los tres tipos. TypeScript NO te deja
// acceder a exercise.sets si exercise.type !== 'strength'
export type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

// Tipo para el formulario (sin pace, se calcula al agregar)
export type ExerciseForm = CardioFormData | StrengthExercise | FlexibilityExercise;

export type DayOfWeek = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

export interface DayPlan {
    day: DayOfWeek;
    exercises: Exercise[];
}

export interface WeeklyPlan {
    name: string;
    entries: DayPlan[];
}

// ─── Personal Info ───
export interface PersonalInfo {
    name: string;
    age: number;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

// ─── Membership ───
export interface Membership {
    plan: string;
    startDate: string;
    isActive: boolean;
}

// ─── User: combina PersonalInfo + Membership + datos propios ───
export interface User extends PersonalInfo, Membership {
    routine: WeeklyPlan | null;
}