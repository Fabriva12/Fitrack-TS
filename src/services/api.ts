import type { ApiNinjaExercise } from "../Types";

const API_BASE = "https://api.api-ninjas.com/v1/exercises";

export class ApiNinjasError extends Error {
    readonly status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "ApiNinjasError";
        this.status = status;
    }
}

export async function searchExercisesByMuscle(muscle: string): Promise<ApiNinjaExercise[]> {
    const apiKey = import.meta.env.VITE_API_NINJAS_KEY as string | undefined;

    if (!apiKey) {
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

    return data as ApiNinjaExercise[];
}
