import { useState } from "react";
import type {
    DaySession,
    Exercise,
    DayOfWeek,
    ExerciseId,
    SessionId,
    ExerciseForm,
} from "../Types";
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
} from "../Logic";

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
            id: crypto.randomUUID(),
            ...formData,
            completed: false,
        };

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
                { id: crypto.randomUUID(), day: selectedDay, exercises: [exercise] },
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
                                onChange={e => handleCategoryChange(e.target.value as Exercise['category'])}
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
                                setFormData(prev => ({ ...prev, name: e.target.value } as ExerciseForm))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Duración (minutos)"
                            value={formData.duration || ""}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, duration: Number(e.target.value) } as ExerciseForm))
                            }
                        />
                        {exerciseCategory === 'cardio' && (
                            <input
                                type="number"
                                placeholder="Calorías quemadas"
                                value={(formData as Extract<ExerciseForm, { category: 'cardio' }>).caloriesBurned || ""}
                                onChange={e =>
                                    setFormData(prev =>
                                        ({ ...prev, caloriesBurned: Number(e.target.value) } as ExerciseForm),
                                    )
                                }
                            />
                        )}
                        {exerciseCategory === 'strength' && (
                            <input
                                type="number"
                                placeholder="Peso levantado (kg)"
                                value={(formData as Extract<ExerciseForm, { category: 'strength' }>).weight || ""}
                                onChange={e =>
                                    setFormData(prev =>
                                        ({ ...prev, weight: Number(e.target.value) } as ExerciseForm),
                                    )
                                }
                            />
                        )}
                        {exerciseCategory === 'flexibility' && (
                            <input
                                type="text"
                                placeholder="Comentarios (ej: tipo de estiramiento)"
                                value={(formData as Extract<ExerciseForm, { category: 'flexibility' }>).comments}
                                onChange={e =>
                                    setFormData(prev =>
                                        ({ ...prev, comments: e.target.value } as ExerciseForm),
                                    )
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
                        {(['cardio', 'strength', 'flexibility'] as const).map(cat => {
                            const catExercises = sessions.flatMap(s =>
                                s.exercises.filter(e => e.category === cat),
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
