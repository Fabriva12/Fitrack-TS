import { useState, useMemo } from "react";
import type {
    DaySession,
    Exercise,
    DayOfWeek,
    ExerciseId,
    SessionId,
    ExerciseForm,
    WorkoutStatus,
    UnifiedReport,
    InvalidExercise,
} from "../Types";
import { nextId } from "../store/id";
import { exerciseStore } from "../store";
import { EXERCISE_CATALOG } from "../data/catalog";
import type { CatalogItem } from "../data/catalog";
import {
    calculateAverageCaloriesPerDay,
    calculateCalories,
    calculateSessionDuration,
    calculateWeeklyLoad,
    calculateRestRecommendation,
    findHighestCalorieExercise,
    findLongestExercise,
    formatDuration,
    getExerciseDescription,
    generateUnifiedReport,
} from "../Logic";
import ExternalSearch from "./ExternalSearch";
import { isCardioExercise, isStrengthExercise, isFlexibilityExercise } from "../guards";

interface WeekViewProps {
    sessions: DaySession[];
    onUpdateSessions: (sessions: DaySession[]) => void;
}

const DAYS: DayOfWeek[] = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
];

const CATEGORY_LABELS: Record<string, string> = {
    cardio: "Cardio",
    strength: "Fuerza",
    flexibility: "Flexibilidad",
};

const CATEGORIES: Exercise['category'][] = ['cardio', 'strength', 'flexibility'];

function parseCategory(value: string): Exercise['category'] {
    if (value === 'cardio' || value === 'strength' || value === 'flexibility') return value;
    return 'cardio';
}

function updateFormName(prev: ExerciseForm, name: string): ExerciseForm {
    switch (prev.category) {
        case 'cardio': return { ...prev, name };
        case 'strength': return { ...prev, name };
        case 'flexibility': return { ...prev, name };
    }
}

function updateFormDuration(prev: ExerciseForm, duration: number): ExerciseForm {
    switch (prev.category) {
        case 'cardio': return { ...prev, duration };
        case 'strength': return { ...prev, duration };
        case 'flexibility': return { ...prev, duration };
    }
}

function updateFormCalories(prev: ExerciseForm, calories: number): ExerciseForm {
    if (prev.category !== 'cardio') return prev;
    return { ...prev, caloriesBurned: calories };
}

function updateFormWeight(prev: ExerciseForm, weight: number): ExerciseForm {
    if (prev.category !== 'strength') return prev;
    return { ...prev, weight };
}

function updateFormComments(prev: ExerciseForm, comments: string): ExerciseForm {
    if (prev.category !== 'flexibility') return prev;
    return { ...prev, comments };
}

function emptyForm(category: Exercise['category']): ExerciseForm {
    switch (category) {
        case 'cardio': return { category: 'cardio', name: '', duration: 0, caloriesBurned: 0 };
        case 'strength': return { category: 'strength', name: '', duration: 0, weight: 0 };
        case 'flexibility': return { category: 'flexibility', name: '', duration: 0, comments: '' };
    }
}

export default function WeekView({ sessions, onUpdateSessions }: WeekViewProps) {
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Lunes");
    const [exerciseCategory, setExerciseCategory] = useState<Exercise['category']>('cardio');
    const [formData, setFormData] = useState<ExerciseForm>(emptyForm('cardio'));
    const [showForm, setShowForm] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [externalInvalid, setExternalInvalid] = useState<InvalidExercise[]>([]);
    const [workoutStatuses, setWorkoutStatuses] = useState<Record<SessionId, WorkoutStatus>>({});

    function getSession(day: DayOfWeek): DaySession | undefined {
        return sessions.find(s => s.day === day);
    }

    function handleToggleCompleted(sessionId: SessionId, exerciseId: ExerciseId) {
        onUpdateSessions(
            sessions.map(s =>
                s.id === sessionId
                    ? {
                        ...s,
                        exercises: s.exercises.map(ex =>
                            ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex,
                        ),
                    }
                    : s,
            ),
        );
    }

    function handleEditNotes(sessionId: SessionId, notes: string) {
        onUpdateSessions(
            sessions.map(s => (s.id === sessionId ? { ...s, notes } : s)),
        );
    }

    function handleAddExternal(exercises: Exercise[]) {
        const session = getSession(selectedDay);
        let updatedSessions: DaySession[];

        for (const ex of exercises) {
            exerciseStore.seed(ex);
        }

        if (session) {
            updatedSessions = sessions.map(s =>
                s.day === selectedDay
                    ? { ...s, exercises: [...s.exercises, ...exercises] }
                    : s,
            );
        } else {
            updatedSessions = [
                ...sessions,
                { id: nextId(), day: selectedDay, exercises },
            ];
        }

        onUpdateSessions(updatedSessions);
        setShowSearch(false);
    }

    const allExercises = useMemo(() => sessions.flatMap(s => s.exercises), [sessions]);
    const apiCount = useMemo(() => allExercises.filter(e => e.origin === 'api').length, [allExercises]);

    const existingNames = useMemo(() => {
        const names = new Set(EXERCISE_CATALOG.map(item => item.name));
        for (const ex of allExercises) names.add(ex.name);
        return names;
    }, [allExercises]);

    const unifiedReport: UnifiedReport = useMemo(
        () => generateUnifiedReport(allExercises, externalInvalid),
        [allExercises, externalInvalid],
    );

    function handleSearchResult(_valid: Exercise[], invalid: InvalidExercise[]) {
        setExternalInvalid(prev => [...prev, ...invalid]);
    }

    function openForm(day: DayOfWeek) {
        setSelectedDay(day);
        setShowForm(true);
    }

    function fillFormFromCatalog(item: CatalogItem) {
        const base = { name: item.name, duration: item.defaultDuration };
        switch (item.category) {
            case 'cardio':
                setExerciseCategory('cardio');
                setFormData({ category: 'cardio', ...base, caloriesBurned: item.defaultCaloriesBurned ?? 0 });
                break;
            case 'strength':
                setExerciseCategory('strength');
                setFormData({ category: 'strength', ...base, weight: item.defaultWeight ?? 0 });
                break;
            case 'flexibility':
                setExerciseCategory('flexibility');
                setFormData({ category: 'flexibility', ...base, comments: item.defaultComments ?? '' });
                break;
        }
    }

    function handleCategoryChange(category: Exercise['category']) {
        setExerciseCategory(category);
        setFormData(emptyForm(category));
    }

    function handleAddExercise() {
        if (!formData.name.trim() || formData.duration <= 0) {
            alert("Completá nombre y duración del ejercicio");
            return;
        }

        if (formData.category === 'cardio' && formData.caloriesBurned <= 0) {
            alert("Ingresá las calorías quemadas para el ejercicio de cardio");
            return;
        }

        if (formData.category === 'strength' && formData.weight <= 0) {
            alert("Ingresá el peso levantado para el ejercicio de fuerza");
            return;
        }

        const exercise: Exercise = {
            id: nextId(),
            ...formData,
            origin: 'local',
            completed: false,
        };

        exerciseStore.seed(exercise);

        const existing = getSession(selectedDay);
        let updatedSessions: DaySession[];

        if (existing) {
            updatedSessions = sessions.map(s =>
                s.day === selectedDay
                    ? { ...s, exercises: [...s.exercises, exercise] }
                    : s,
            );
        } else {
            updatedSessions = [
                ...sessions,
                { id: nextId(), day: selectedDay, exercises: [exercise] },
            ];
        }

        onUpdateSessions(updatedSessions);
        setFormData(emptyForm(exerciseCategory));
    }

    const load = calculateWeeklyLoad(sessions);
    const reco = calculateRestRecommendation(sessions);
    const longestExercise = findLongestExercise(sessions);
    const highestCalorieExercise = findHighestCalorieExercise(sessions);

    return (
        <section className="week-view">
            <div className="week-stats">
                <span className="stat"><strong>Total:</strong> {formatDuration(load.totalMinutes)}</span>
                <span className="stat">
                    <strong>Calorías:</strong> {load.totalCalories} cal
                    {sessions.length > 0 && (
                        <> | <strong>Promedio:</strong> {calculateAverageCaloriesPerDay(sessions)} cal ({sessions.length} día{sessions.length !== 1 ? 's' : ''} entrenados)</>
                    )}
                </span>
            </div>

            {sessions.length > 0 && (
                <div className="exercise-stats">
                    <p>
                        <strong>Ejercicio más largo:</strong>{' '}
                        {longestExercise
                            ? `${longestExercise.name} (${formatDuration(longestExercise.duration)})`
                            : '—'}
                        {' | '}
                        <strong>Ejercicio más intenso:</strong>{' '}
                        {highestCalorieExercise
                            ? `${highestCalorieExercise.name} (${calculateCalories(highestCalorieExercise)} cal)`
                            : '—'}
                    </p>
                </div>
            )}

            {sessions.length > 0 && (
                <div className="week-load-detailed">
                    <div className="load-bar">
                        {load.totalMinutes > 0 && (
                            <>
                                <span className="load-bar-segment cardio" style={{ width: `${(load.cardioMinutes / load.totalMinutes) * 100}%` }} />
                                <span className="load-bar-segment strength" style={{ width: `${(load.strengthMinutes / load.totalMinutes) * 100}%` }} />
                                <span className="load-bar-segment flexibility" style={{ width: `${(load.flexibilityMinutes / load.totalMinutes) * 100}%` }} />
                            </>
                        )}
                    </div>
                    <div className="load-categories">
                        <div className="load-cat cardio">
                            <span className="load-cat-dot" />
                            <span className="load-cat-label">Cardio</span>
                            <span className="load-cat-min">{formatDuration(load.cardioMinutes)}</span>
                        </div>
                        <div className="load-cat strength">
                            <span className="load-cat-dot" />
                            <span className="load-cat-label">Fuerza</span>
                            <span className="load-cat-min">{formatDuration(load.strengthMinutes)}</span>
                        </div>
                        <div className="load-cat flexibility">
                            <span className="load-cat-dot" />
                            <span className="load-cat-label">Flexibilidad</span>
                            <span className="load-cat-min">{formatDuration(load.flexibilityMinutes)}</span>
                        </div>
                    </div>
                </div>
            )}

            {sessions.length > 0 && (
                <div className={`reco-card reco-${reco.level}`}>
                    <div className="reco-card-header">
                        <span className="reco-icon">
                            {reco.level === 'high' ? '🔴' : reco.level === 'low' ? '⚠️' : '✅'}
                        </span>
                        <span className="reco-title">Recomendación de descanso</span>
                    </div>
                    <p className="reco-message">{reco.message}</p>
                    <div className="reco-detail">
                        <span><strong>{sessions.length}</strong> de 7 días entrenados</span>
                        <span><strong>{formatDuration(load.totalMinutes)}</strong> totales en la semana</span>
                    </div>
                </div>
            )}

            <div className="action-buttons">
                <button className="btn-action" onClick={() => setShowSearch(prev => !prev)}>
                    {showSearch ? "Cerrar búsqueda" : "Buscar en API"}
                </button>
                <button className="btn-action" onClick={() => setShowReport(true)}>
                    Reporte unificado
                </button>
            </div>

            {showSearch && (
                <ExternalSearch
                    muscleGroups={[
                        "abdominals", "abductors", "biceps", "calves", "chest",
                        "forearms", "glutes", "hamstrings", "lats", "lower_back",
                        "middle_back", "neck", "quadriceps", "traps", "triceps",
                    ]}
                    existingNames={existingNames}
                    onAddExercises={handleAddExternal}
                    onSearchResult={handleSearchResult}
                    sessionDay={selectedDay}
                />
            )}

            {showReport && (
                <div className="modal-overlay" onClick={() => setShowReport(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Reporte unificado</h3>
                            <button className="btn-close" onClick={() => setShowReport(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="report-summary">
                                <span className="rs-total">
                                    Total ejercicios: {allExercises.length}
                                </span>
                                <span className="rs-local">
                                    Locales: {allExercises.length - apiCount}
                                </span>
                                <span className="rs-api">
                                    API: {apiCount}
                                </span>
                            </div>
                            {CATEGORIES.map(cat => {
                                const exercises = unifiedReport.byCategory[cat];
                                if (!exercises || exercises.length === 0) return null;
                                const totalMin = exercises.reduce((s, e) => s + e.duration, 0);
                                return (
                                    <div key={cat} className="report-category">
                                        <h4 className={`${cat}-header`}>{CATEGORY_LABELS[cat]} ({exercises.length})</h4>
                                        <p className="report-total">{totalMin} min totales</p>
                                        <ul className="report-list">
                                            {exercises.map(e => (
                                                <li key={e.id} className="report-item">
                                                    <span className="ri-name">{e.name}</span>
                                                    <span className={`ri-source ${e.origin === 'api' ? 'external' : 'local'}`}>
                                                        {e.origin === 'api' ? 'API' : 'Local'}
                                                    </span>
                                                    <span className="ri-duration">{e.duration}min</span>
                                                    <span className="ri-desc">{getExerciseDescription(e)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                            {unifiedReport.invalid.length > 0 && (
                                <div className="report-invalid">
                                    <h4>Ejercicios con datos incompletos ({unifiedReport.invalid.length})</h4>
                                    <ul className="report-invalid-list">
                                        {unifiedReport.invalid.map((inv, i) => (
                                            <li key={i} className="report-invalid-item">
                                                <span className="ri-name">{inv.data.name || "Sin nombre"}</span>
                                                <span className="ri-reason">{inv.reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {unifiedReport.invalid.length === 0 &&
                                Object.keys(unifiedReport.byCategory).length === 0 && (
                                <p className="report-empty">No hay ejercicios para mostrar.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="day-grid">
                {DAYS.map(day => {
                    const session = getSession(day);
                    const dayDuration = session ? calculateSessionDuration(session) : 0;
                    const completedCount = session
                        ? session.exercises.filter(e => e.completed).length
                        : 0;

                    return (
                        <div
                            key={day}
                            className={`day-column ${selectedDay === day ? 'active' : ''} ${session ? 'has-session' : ''}`}
                        >
                            <h4 className="day-header">
                                {day}
                                {session && (
                                    <small className="day-stats">
                                        {dayDuration} min · {completedCount}/{session.exercises.length}
                                    </small>
                                )}
                            </h4>
                            {session && (
                                <div className="workout-status-group">
                                    <button
                                        className={`status-btn ${(workoutStatuses[session.id] ?? "pending") === "pending" ? "active" : ""}`}
                                        onClick={() => setWorkoutStatuses(prev => ({ ...prev, [session.id]: "pending" }))}
                                    >Pendiente</button>
                                    <button
                                        className={`status-btn ${(workoutStatuses[session.id] ?? "pending") === "completed" ? "active" : ""}`}
                                        onClick={() => setWorkoutStatuses(prev => ({ ...prev, [session.id]: "completed" }))}
                                    >Completado</button>
                                    <button
                                        className={`status-btn ${(workoutStatuses[session.id] ?? "pending") === "skipped" ? "active" : ""}`}
                                        onClick={() => setWorkoutStatuses(prev => ({ ...prev, [session.id]: "skipped" }))}
                                    >Saltado</button>
                                </div>
                            )}
                            <div className="day-exercises">
                                {session ? (
                                    session.exercises.map(ex => (
                                        <div key={ex.id} className={`exercise-item ${ex.completed ? 'done' : ''}`}>
                                            <div className="ex-row">
                                                <input
                                                    type="checkbox"
                                                    checked={ex.completed}
                                                    onChange={() => handleToggleCompleted(session.id, ex.id)}
                                                />
                                                <span className="ex-name">{ex.name}</span>
                                                <span className="ex-status">{ex.completed ? '✅' : '❌'}</span>
                                            </div>
                                            <div className="ex-details">
                                                <span className={`ex-category cat-${ex.category}`}>
                                                    {CATEGORY_LABELS[ex.category]}
                                                </span>
                                                <span className="ex-duration">{ex.duration}min</span>
                                                <span className="ex-desc">{getExerciseDescription(ex)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-day">Sin ejercicios</p>
                                )}
                            </div>
                            {session && (
                                <textarea
                                    className="session-notes"
                                    placeholder="Notas del día..."
                                    value={session.notes ?? ''}
                                    onChange={e => handleEditNotes(session.id, e.target.value)}
                                    rows={2}
                                />
                            )}
                            <button
                                className="btn-add-day"
                                onClick={() => openForm(day)}
                            >
                                + Agregar
                            </button>
                        </div>
                    );
                })}
            </div>

            {showForm && (
                <div className="add-exercise-section">
                    <h3>Agregar ejercicio a {selectedDay}</h3>

                    <div className="form-category-select">
                        <label>Categoría:
                            <select
                                value={exerciseCategory}
                                onChange={e => handleCategoryChange(parseCategory(e.target.value))}
                            >
                                <option value="cardio">Cardio</option>
                                <option value="strength">Fuerza</option>
                                <option value="flexibility">Flexibilidad</option>
                            </select>
                        </label>
                        <button className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                    </div>

                    <div className="catalog-grid">
                        {EXERCISE_CATALOG
                            .filter(item => item.category === exerciseCategory)
                            .map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="catalog-item"
                                    onClick={() => fillFormFromCatalog(item)}
                                >
                                    <span className="ci-name">{item.name}</span>
                                    <small className="ci-detail">
                                        {item.defaultDuration}min
                                        {item.defaultCaloriesBurned && ` · ${item.defaultCaloriesBurned}cal`}
                                        {item.defaultWeight && ` · ${item.defaultWeight}kg`}
                                    </small>
                                </button>
                            ))}
                        <button
                            type="button"
                            className="catalog-item custom"
                            onClick={() => setFormData(emptyForm(exerciseCategory))}
                        >
                            <span className="ci-name">Personalizado</span>
                            <small className="ci-detail">Completá los datos manualmente</small>
                        </button>
                    </div>

                    <div className="form-fields">
                        <input
                            type="text"
                            placeholder="Nombre del ejercicio"
                            value={formData.name}
                            onChange={e =>
                                setFormData(prev => updateFormName(prev, e.target.value))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Duración (minutos)"
                            value={formData.duration || ""}
                            onChange={e =>
                                setFormData(prev => updateFormDuration(prev, Number(e.target.value)))
                            }
                        />
                        {exerciseCategory === 'cardio' && (
                            <input
                                type="number"
                                placeholder="Calorías quemadas"
                                value={formData.category === 'cardio' ? formData.caloriesBurned || "" : ""}
                                onChange={e =>
                                    setFormData(prev => updateFormCalories(prev, Number(e.target.value)))
                                }
                            />
                        )}
                        {exerciseCategory === 'strength' && (
                            <input
                                type="number"
                                placeholder="Peso levantado (kg)"
                                value={formData.category === 'strength' ? formData.weight || "" : ""}
                                onChange={e =>
                                    setFormData(prev => updateFormWeight(prev, Number(e.target.value)))
                                }
                            />
                        )}
                        {exerciseCategory === 'flexibility' && (
                            <input
                                type="text"
                                placeholder="Comentarios (ej: tipo de estiramiento)"
                                value={formData.category === 'flexibility' ? formData.comments : ""}
                                onChange={e =>
                                    setFormData(prev => updateFormComments(prev, e.target.value))
                                }
                            />
                        )}
                        <button type="button" className="btn-add" onClick={handleAddExercise}>
                            Agregar a {selectedDay}
                        </button>
                    </div>
                </div>
            )}

            {sessions.length > 0 && (
                <div className="category-summary">
                    <h3>Resumen por categoría</h3>
                    <div className="category-grid">
                        {CATEGORIES.map(cat => {
                            const byGuard = cat === 'cardio' ? isCardioExercise : cat === 'strength' ? isStrengthExercise : isFlexibilityExercise;
                            const catExercises = sessions.flatMap(s =>
                                s.exercises.filter(byGuard),
                            );
                            if (catExercises.length === 0) return null;
                            const catDuration = catExercises.reduce((sum, e) => sum + e.duration, 0);
                            return (
                                <div key={cat} className="cat-block">
                                    <h4>{CATEGORY_LABELS[cat]}</h4>
                                    <p>{catExercises.length} ejercicios · {formatDuration(catDuration)}</p>
                                    <ul>
                                        {catExercises.map(e => (
                                            <li key={e.id} className={e.completed ? 'done' : ''}>
                                                {e.name} ({e.duration}min)
                                                {e.completed ? ' ✓' : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </section>
    );
}
