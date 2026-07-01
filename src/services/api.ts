const API_BASE = "https://api.api-ninjas.com/v1/exercises";

export class ApiNinjasError extends Error {
    readonly status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "ApiNinjasError";
        this.status = status;
    }
}

interface RawApiItem {
    name: unknown;
    type: unknown;
    instructions: unknown;
    muscle: unknown;
    equipment: unknown;
    difficulty: unknown;
    [key: string]: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function isApiItem(value: unknown): value is RawApiItem {
    return isRecord(value) && "name" in value && "type" in value && "instructions" in value;
}

function structuralFields(item: RawApiItem): boolean {
    return isString(item.name) && item.name.trim().length > 0
        && isString(item.type) && item.type.trim().length > 0
        && isString(item.instructions) && item.instructions.trim().length > 0
        && isString(item.muscle)
        && isString(item.equipment)
        && isString(item.difficulty);
}

export async function searchExercisesByMuscle(muscle: string): Promise<unknown[]> {
    const apiKey = import.meta.env.VITE_API_NINJAS_KEY;

    if (typeof apiKey !== "string" || apiKey.length === 0) {
        throw new ApiNinjasError(
            "API key no configurada. Creá la variable VITE_API_NINJAS_KEY en el archivo .env",
        );
    }

    const trimmed = muscle.trim();
    if (trimmed.length === 0) {
        throw new ApiNinjasError("El grupo muscular no puede estar vacío");
    }

    const url = `${API_BASE}?muscle=${encodeURIComponent(trimmed)}`;

    let response: Response;

    try {
        response = await fetch(url, {
            headers: { "X-Api-Key": apiKey },
            signal: AbortSignal.timeout(10_000),
        });
    } catch (err) {
        if (err instanceof DOMException && err.name === "TimeoutError") {
            throw new ApiNinjasError("La API no respondió a tiempo. Intentalo de nuevo.");
        }
        throw new ApiNinjasError(
            "No se pudo conectar con la API. Verificá tu conexión a internet.",
        );
    }

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new ApiNinjasError(
            `Error de API (${response.status}): ${text || response.statusText}`,
            response.status,
        );
    }

    let data: unknown;
    try {
        data = await response.json();
    } catch {
        throw new ApiNinjasError("La respuesta de la API no es JSON válido.");
    }

    if (!Array.isArray(data)) {
        throw new ApiNinjasError("La API devolvió un formato inesperado.");
    }

    const validated: unknown[] = [];
    for (const item of data) {
        if (!isApiItem(item) || !structuralFields(item)) {
            throw new ApiNinjasError("Ítem de API con estructura inválida: faltan campos obligatorios (name, type, instructions).");
        }
        validated.push(item);
    }

    return validated;
}
