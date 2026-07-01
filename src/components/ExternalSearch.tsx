import { useState, type FormEvent } from "react";
import type { Exercise, InvalidExercise } from "../Types";
import { searchExercisesByMuscle, ApiNinjasError } from "../services/api";
import { validateExternalExercises } from "../services/validation";
import { getExerciseDescription } from "../Logic";

type SearchStatus = "idle" | "loading" | "success" | "error";

interface ExternalSearchProps {
    muscleGroups: string[];
    existingNames: Set<string>;
    onAddExercises: (exercises: Exercise[]) => void;
    onSearchResult: (valid: Exercise[], invalid: InvalidExercise[]) => void;
    sessionDay: string;
}

export default function ExternalSearch({ muscleGroups, existingNames, onAddExercises, onSearchResult, sessionDay }: ExternalSearchProps) {
    const [muscle, setMuscle] = useState("");
    const [status, setStatus] = useState<SearchStatus>("idle");
    const [validExercises, setValidExercises] = useState<Exercise[]>([]);
    const [invalidExercises, setInvalidExercises] = useState<InvalidExercise[]>([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    async function handleSearch(e: FormEvent) {
        e.preventDefault();
        const trimmed = muscle.trim();
        if (trimmed.length === 0) return;

        setStatus("loading");
        setValidExercises([]);
        setInvalidExercises([]);
        setSelectedIds(new Set());
        setErrorMsg("");

        try {
            const apiExercises = await searchExercisesByMuscle(trimmed);
            const result = validateExternalExercises(apiExercises, existingNames);
            setValidExercises(result.valid);
            setInvalidExercises(result.invalid);
            onSearchResult(result.valid, result.invalid);
            setStatus("success");
        } catch (err) {
            if (err instanceof ApiNinjasError) {
                setErrorMsg(err.message);
            } else {
                setErrorMsg("Ocurrió un error inesperado al buscar ejercicios.");
            }
            setStatus("error");
        }
    }

    function toggleSelect(id: string) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function handleAddSelected() {
        const toAdd = validExercises.filter(ex => selectedIds.has(ex.id));
        if (toAdd.length > 0) {
            onAddExercises(toAdd);
            setStatus("idle");
            setMuscle("");
        }
    }

    return (
        <div className="external-search">
            <form className="search-form" onSubmit={handleSearch}>
                <div className="search-row">
                    <select
                        value={muscle}
                        onChange={e => setMuscle(e.target.value)}
                        disabled={status === "loading"}
                    >
                        <option value="">Seleccioná un grupo muscular</option>
                        {muscleGroups.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="O escribilo manualmente..."
                        value={muscle}
                        onChange={e => setMuscle(e.target.value)}
                        disabled={status === "loading"}
                    />
                    <button type="submit" disabled={status === "loading" || muscle.trim().length === 0}>
                        {status === "loading" ? "Buscando..." : "Buscar en API"}
                    </button>
                </div>
            </form>

            {status === "loading" && (
                <div className="search-loading">
                    <span className="search-spinner" />
                    <span>Buscando ejercicios para {muscle}...</span>
                </div>
            )}

            {status === "error" && (
                <div className="search-error">
                    <p className="error-title">Error al buscar</p>
                    <p>{errorMsg}</p>
                </div>
            )}

            {status === "success" && (
                <div className="search-results">
                    {validExercises.length === 0 && invalidExercises.length === 0 && (
                        <p className="search-empty">No se encontraron ejercicios para este grupo muscular.</p>
                    )}

                    {validExercises.length > 0 && (
                        <>
                            <h4>Ejercicios válidos ({validExercises.length})</h4>
                            <div className="valid-list">
                                {validExercises.map(ex => (
                                    <label key={ex.id} className="valid-item">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(ex.id)}
                                            onChange={() => toggleSelect(ex.id)}
                                        />
                                        <div className="valid-item-info">
                                            <span className="vi-name">{ex.name}</span>
                                            <span className="vi-category">{ex.category}</span>
                                            <span className="vi-desc">{getExerciseDescription(ex)}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {selectedIds.size > 0 && (
                                <button className="btn-add-selected" onClick={handleAddSelected}>
                                    Agregar {selectedIds.size} ejercicio{selectedIds.size !== 1 ? "s" : ""} a {sessionDay}
                                </button>
                            )}
                        </>
                    )}

                    {invalidExercises.length > 0 && (
                        <div className="invalid-section">
                            <h4>Ejercicios con datos incompletos ({invalidExercises.length})</h4>
                            <p className="invalid-hint">Estos ejercicios no cumplen con los campos mínimos requeridos y no se pueden agregar.</p>
                            <ul className="invalid-list">
                                {invalidExercises.map((inv, i) => (
                                    <li key={i} className="invalid-item">
                                        <span className="ii-name">{inv.data.name || "Sin nombre"}</span>
                                        <span className="ii-reason">{inv.reason}</span>
                                        {inv.data.type && <span className="ii-type">{inv.data.type}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
