import type {
    ApiNinjaExercise,
    Exercise,
    ExerciseCategory,
    ValidationResult,
    InvalidExercise,
} from "../Types";
import { mapApiToCategory } from "../Logic";
import { nextId } from "../store/id";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function extractString(value: unknown, fallback: string = ""): string {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

export function validateExternalExercises(
    apiExercises: unknown[],
    existingNames: Set<string>,
): ValidationResult {
    const valid: Exercise[] = [];
    const invalid: InvalidExercise[] = [];

    for (const raw of apiExercises) {
        if (!isRecord(raw)) {
            invalid.push({
                data: { name: "", type: "", muscle: "", equipment: "", difficulty: "", instructions: "" },
                reason: "No es un objeto válido",
            });
            continue;
        }

        const name = extractString(raw.name);
        const type = extractString(raw.type);
        const instructions = extractString(raw.instructions);
        const reasons: string[] = [];

        if (!name) reasons.push("Falta el nombre del ejercicio");
        if (!type) reasons.push("Falta el tipo de ejercicio");
        if (!instructions) reasons.push("Faltan las instrucciones");

        const partial: ApiNinjaExercise = {
            name,
            type,
            instructions,
            muscle: extractString(raw.muscle),
            equipment: extractString(raw.equipment),
            difficulty: extractString(raw.difficulty),
        };

        if (reasons.length > 0) {
            invalid.push({ data: partial, reason: reasons.join("; ") });
            continue;
        }

        const category = mapApiToCategory(type);

        if (category === null) {
            invalid.push({
                data: partial,
                reason: `Tipo de ejercicio desconocido: "${type}"`,
            });
            continue;
        }

        if (existingNames.has(name)) {
            invalid.push({
                data: partial,
                reason: `El ejercicio "${name}" ya existe en el catálogo`,
            });
            continue;
        }

        const exercise = buildExercise(partial, category);
        valid.push(exercise);
    }

    return { valid, invalid };
}

function buildExercise(api: ApiNinjaExercise, category: ExerciseCategory): Exercise {
    switch (category) {
        case "cardio":
            return {
                id: nextId(),
                name: api.name,
                completed: false,
                origin: 'api',
                category: "cardio",
                duration: 30,
                caloriesBurned: estimateCardioCalories(api),
            };
        case "strength":
            return {
                id: nextId(),
                name: api.name,
                completed: false,
                origin: 'api',
                category: "strength",
                duration: 20,
                weight: 0,
            };
        case "flexibility":
            return {
                id: nextId(),
                name: api.name,
                completed: false,
                origin: 'api',
                category: "flexibility",
                duration: 25,
                comments: api.instructions.slice(0, 200),
            };
    }
}

function estimateCardioCalories(api: ApiNinjaExercise): number {
    const difficulty = api.difficulty?.toLowerCase() ?? "";
    if (difficulty === "beginner") return 150;
    if (difficulty === "intermediate") return 250;
    if (difficulty === "expert") return 350;
    return 200;
}
