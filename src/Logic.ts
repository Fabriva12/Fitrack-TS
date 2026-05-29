import type {
    Exercise,
    DaySession,
    WeeklyLoad,
    RestRecommendation,
    RestLevel,
} from "./Types";

export function calculateCalories(exercise: Exercise): number {
    if (exercise.category === 'cardio') {
        return exercise.caloriesBurned;
    }
    return 0;
}

export function calculateSessionCalories(session: DaySession): number {
    return session.exercises.reduce((sum, ex) => sum + calculateCalories(ex), 0);
}

export function calculateSessionDuration(session: DaySession): number {
    return session.exercises.reduce((sum, ex) => sum + ex.duration, 0);
}

export function calculateRoutineCalories(sessions: DaySession[]): number {
    return sessions.reduce((sum, s) => sum + calculateSessionCalories(s), 0);
}

export function calculateRoutineDuration(sessions: DaySession[]): number {
    return sessions.reduce((sum, s) => sum + calculateSessionDuration(s), 0);
}

export function calculateAverageCaloriesPerDay(sessions: DaySession[]): number {
    if (sessions.length === 0) return 0;
    return Math.round(calculateRoutineCalories(sessions) / sessions.length);
}

export function formatDuration(minutes: number): string {
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remaining = minutes % 60;
        return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}min`;
    }
    return `${minutes}min`;
}

export function findLongestExercise(sessions: DaySession[]): Exercise | null {
    let longest: Exercise | null = null;
    for (const session of sessions) {
        for (const ex of session.exercises) {
            if (!longest || ex.duration > longest.duration) {
                longest = ex;
            }
        }
    }
    return longest;
}

export function findHighestCalorieExercise(sessions: DaySession[]): Exercise | null {
    let highest: Exercise | null = null;
    let maxCalories = 0;
    for (const session of sessions) {
        for (const ex of session.exercises) {
            const cal = calculateCalories(ex);
            if (!highest || cal > maxCalories) {
                maxCalories = cal;
                highest = ex;
            }
        }
    }
    return highest;
}

export function calculatePercentageOfTotal(calories: number, totalCalories: number): number {
    if (totalCalories === 0) return 0;
    return Math.round((calories / totalCalories) * 100);
}

export function getExerciseDescription(exercise: Exercise): string {
    switch (exercise.category) {
        case 'cardio':
            return `${exercise.caloriesBurned} cal quemadas`;
        case 'strength':
            return `${exercise.weight}kg levantados`;
        case 'flexibility':
            return exercise.comments || 'Sin comentarios';
    }
}

export function calculateWeeklyLoad(sessions: DaySession[]): WeeklyLoad {
    let totalCalories = 0;
    let cardioMinutes = 0;
    let strengthMinutes = 0;
    let flexibilityMinutes = 0;

    for (const session of sessions) {
        for (const ex of session.exercises) {
            switch (ex.category) {
                case 'cardio': {
                    cardioMinutes += ex.duration;
                    totalCalories += ex.caloriesBurned;
                    break;
                }
                case 'strength': {
                    strengthMinutes += ex.duration;
                    break;
                }
                case 'flexibility': {
                    flexibilityMinutes += ex.duration;
                    break;
                }
            }
        }
    }

    const totalMinutes = cardioMinutes + strengthMinutes + flexibilityMinutes;

    return {
        totalMinutes,
        totalCalories,
        cardioMinutes,
        strengthMinutes,
        flexibilityMinutes,
    };
}

export function calculateRestRecommendation(sessions: DaySession[]): RestRecommendation {
    const trainingDays = sessions.length;
    const totalMinutes = sessions.reduce(
        (sum, s) => sum + s.exercises.reduce((acc, ex) => acc + ex.duration, 0),
        0,
    );

    const trainsTooMuch = trainingDays > 5 || totalMinutes > 300;
    const trainsTooLittle = trainingDays < 3 || totalMinutes < 150;

    let level: RestLevel;
    let message: string;

    if (trainsTooMuch) {
        level = 'high';
        message = 'Entrenás mucho. Considerá agregar más días de descanso para evitar sobreentrenamiento.';
    } else if (trainsTooLittle) {
        level = 'low';
        message = 'Entrenás poco. Aumentá la frecuencia o duración de tus sesiones para ver mejores resultados.';
    } else {
        level = 'moderate';
        message = 'Tu carga de entrenamiento está en un rango saludable. Seguí así.';
    }

    return { level, message, trainsTooMuch, trainsTooLittle };
}
