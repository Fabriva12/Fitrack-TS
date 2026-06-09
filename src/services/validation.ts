import type {
    ApiNinjaExercise,
    Exercise,
    ExerciseCategory,
    ValidationResult,
    InvalidExercise,
} from "../Types";
import { mapApiToCategory } from "../Logic";

function hasMinimalFields(raw: unknown): raw is Record<string, unknown> {
    if (typeof raw !== "object" || raw === null) return false;
    return true;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function validateExternalExercises(
    apiExercises: ApiNinjaExercise[],
    existingNames: Set<string>,
): ValidationResult {
    const valid: Exercise[] = [];
    const invalid: InvalidExercise[] = [];

    for (const raw of apiExercises) {
        if (!hasMinimalFields(raw)) {
            invalid.push({ data: raw as ApiNinjaExercise, reason: "No es un objeto válido" });
            continue;
        }

        const ex = raw as Record<string, unknown>;
        const reasons: string[] = [];

        if (!isNonEmptyString(ex.name)) {
            reasons.push("Falta el nombre del ejercicio");
        }

        if (!isNonEmptyString(ex.type)) {
            reasons.push("Falta el tipo de ejercicio");
        }

        if (!isNonEmptyString(ex.instructions)) {
            reasons.push("Faltan las instrucciones");
        }

        if (reasons.length > 0) {
            invalid.push({ data: raw as ApiNinjaExercise, reason: reasons.join("; ") });
            continue;
        }

        const apiType = ex.type as string;
        const category = mapApiToCategory(apiType);

        if (category === null) {
            invalid.push({
                data: raw as ApiNinjaExercise,
                reason: `Tipo de ejercicio desconocido: "${apiType}"`,
            });
            continue;
        }

        const name = ex.name as string;

        if (existingNames.has(name)) {
            invalid.push({
                data: raw as ApiNinjaExercise,
                reason: `El ejercicio "${name}" ya existe en el catálogo`,
            });
            continue;
        }

        const exercise = buildExercise(raw as ApiNinjaExercise, category);
        valid.push(exercise);
    }

    return { valid, invalid };
}

function buildExercise(api: ApiNinjaExercise, category: ExerciseCategory): Exercise {
    const base = {
        id: crypto.randomUUID(),
        name: api.name,
        completed: false,
    };

    switch (category) {
        case "cardio": {
            return {
                ...base,
                category: "cardio",
                duration: 30,
                caloriesBurned: estimateCardioCalories(api),
            } as Exercise;
        }
        case "strength": {
            return {
                ...base,
                category: "strength",
                duration: 20,
                weight: 0,
            } as Exercise;
        }
        case "flexibility": {
            return {
                ...base,
                category: "flexibility",
                duration: 25,
                comments: api.instructions.slice(0, 200),
            } as Exercise;
        }
    }
}

function estimateCardioCalories(api: ApiNinjaExercise): number {
    const difficulty = api.difficulty?.toLowerCase() ?? "";
    if (difficulty === "beginner") return 150;
    if (difficulty === "intermediate") return 250;
    if (difficulty === "expert") return 350;
    return 200;
}
