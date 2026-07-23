export type ExerciseId = number;
export type UserId = number;
export type InstructorId = number;
export type RoutineId = number;
export type SessionId = number;

export type DayOfWeek = "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseCategory = 'cardio' | 'strength' | 'flexibility';

export type RestLevel = 'low' | 'moderate' | 'high';

export interface Person {
    name: string;
    age: number;
    email: string;
}

interface ExerciseBase {
    id: ExerciseId;
    name: string;
    duration: number;
    completed: boolean;
    origin: 'local' | 'api';
}

export interface CardioExercise extends ExerciseBase {
    category: 'cardio';
    caloriesBurned: number;
}

export interface StrengthExercise extends ExerciseBase {
    category: 'strength';
    weight: number;
    previousWeight?: number;
}

export interface FlexibilityExercise extends ExerciseBase {
    category: 'flexibility';
    comments: string;
}

export type Exercise = CardioExercise | StrengthExercise | FlexibilityExercise;

export interface CardioForm {
    category: 'cardio';
    name: string;
    duration: number;
    caloriesBurned: number;
}

export interface StrengthForm {
    category: 'strength';
    name: string;
    duration: number;
    weight: number;
}

export interface FlexibilityForm {
    category: 'flexibility';
    name: string;
    duration: number;
    comments: string;
}

export type ExerciseForm = CardioForm | StrengthForm | FlexibilityForm;

export interface DaySession {
    id: SessionId;
    day: DayOfWeek;
    exercises: Exercise[];
    notes?: string;
}

export interface WeeklyRoutine {
    id: RoutineId;
    name: string;
    startDate: string;
    sessionIds: SessionId[];
}

export interface User extends Person {
    id: UserId;
    experienceLevel: ExperienceLevel;
    routineId: RoutineId | null;
}

export interface Instructor extends Person {
    id: InstructorId;
    assignedUsers: UserId[];
}

export interface WeeklyLoad {
    totalMinutes: number;
    totalCalories: number;
    cardioMinutes: number;
    strengthMinutes: number;
    flexibilityMinutes: number;
}

export interface RestRecommendation {
    level: RestLevel;
    message: string;
    trainsTooMuch: boolean;
    trainsTooLittle: boolean;
}

export type WorkoutStatus = 'pending' | 'completed' | 'skipped';

export interface ApiNinjaExercise {
    name: string;
    type: string;
    muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
}

export interface InvalidExercise {
    data: ApiNinjaExercise;
    reason: string;
}

export interface ValidationResult {
    valid: Exercise[];
    invalid: InvalidExercise[];
}

export interface UnifiedReport {
    byCategory: Partial<Record<ExerciseCategory, Exercise[]>>;
    invalid: InvalidExercise[];
}
