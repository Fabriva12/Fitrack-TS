import type { Exercise, CardioExercise, StrengthExercise, FlexibilityExercise } from "./Types";

export function isCardioExercise(ex: Exercise): ex is CardioExercise {
    return ex.category === "cardio" && typeof ex.caloriesBurned === "number";
}

export function isStrengthExercise(ex: Exercise): ex is StrengthExercise {
    return ex.category === "strength" && typeof ex.weight === "number";
}

export function isFlexibilityExercise(ex: Exercise): ex is FlexibilityExercise {
    return ex.category === "flexibility" && typeof ex.comments === "string";
}
