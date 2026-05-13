import type { Exercise, DayPlan, DayOfWeek } from "./Types";

export function calculateCalories(exercise: Exercise): number {
    return exercise.time * exercise.caloriesBurned;
}

export function calculatePace(exercise: Exercise): number | null {
    if (exercise.distance === undefined || exercise.distance === 0) {
        return null;
    }
    return Math.round((exercise.time / exercise.distance) * 100) / 100;
}

export function calculateRoutineTotalCalories(entries: DayPlan[]): number {
    let total: number = 0;
    for (const entry of entries) {
        for (const exercise of entry.exercises) {
            total += calculateCalories(exercise);
        }
    }
    return total;
}

export function calculateAverageCaloriesPerWorkoutDay(entries: DayPlan[]): number {
    const daysWithExercise: number = entries.length;
    if (daysWithExercise === 0) {
        return 0;
    }
    const total: number = calculateRoutineTotalCalories(entries);
    return Math.round(total / daysWithExercise);
}

export function formatDuration(minutes: number): string {
    if (minutes >= 60) {
        const hours: number = Math.floor(minutes / 60);
        const remainingMinutes: number = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${remainingMinutes}min`;
    }
    return `${minutes}min`;
}

export function findHighestCalorieDay(entries: DayPlan[]): DayOfWeek | null {
    if (entries.length === 0) {
        return null;
    }
    let highestDay: DayOfWeek = entries[0].day;
    let highestCalories: number = calculateRoutineTotalCalories([entries[0]]);
    for (const entry of entries) {
        const calories: number = calculateRoutineTotalCalories([entry]);
        if (calories > highestCalories) {
            highestCalories = calories;
            highestDay = entry.day;
        }
    }
    return highestDay;
}

export function findLongestExercise(entries: DayPlan[]): Exercise | null {
    if (entries.length === 0) {
        return null;
    }

    let longest: Exercise | null = null;
    for (const entry of entries) {
        for (const exercise of entry.exercises) {
            if (!longest || exercise.time > longest.time) {
                longest = exercise;
            }
        }
    }
    return longest;
}

export function findHighestCalorieExercise(entries: DayPlan[]): Exercise | null {
    if (entries.length === 0) {
        return null;
    }

    let highest: Exercise | null = null;
    let highestCalories: number = 0;
    for (const entry of entries) {
        for (const exercise of entry.exercises) {
            const calories: number = calculateCalories(exercise);
            if (!highest || calories > highestCalories) {
                highestCalories = calories;
                highest = exercise;
            }
        }
    }
    return highest;
}

export function calculatePercentageOfTotal(exercise: Exercise, totalCalories: number): number {
    if (totalCalories === 0) {
        return 0;
    }
    return Math.round((calculateCalories(exercise) / totalCalories) * 100);
}