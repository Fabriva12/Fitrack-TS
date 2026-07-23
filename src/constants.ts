import type { ExperienceLevel, RestLevel, DayOfWeek, Exercise } from "./Types";

export const CATEGORIES: Exercise['category'][] = ['cardio', 'strength', 'flexibility'];

export const LEVEL_LABEL: Record<ExperienceLevel, string> = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
};

export const RECO_ICON: Record<RestLevel, string> = {
    low: "⚠️",
    moderate: "✅",
    high: "🔴",
};

export const DAYS: DayOfWeek[] = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

export const CATEGORY_LABELS: Record<string, string> = {
    cardio: "Cardio",
    strength: "Fuerza",
    flexibility: "Flexibilidad",
};
