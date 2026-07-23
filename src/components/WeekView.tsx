import { useState, useMemo } from "react";
import type {
    DaySession,
    Exercise,
    DayOfWeek,
    ExerciseId,
    SessionId,
    ExerciseForm as ExerciseFormType,
    StrengthExercise,
    WorkoutStatus,
    InvalidExercise,
} from "../Types";
import { exerciseStore } from "../store";
import { EXERCISE_CATALOG } from "../data/catalog";
import type { CatalogItem } from "../data/catalog";
import {
    calculateAverageCaloriesPerDay,
    calculateCalories,
    calculateWeeklyLoad,
    calculateRestRecommendation,
    findHighestCalorieExercise,
    findLongestExercise,
    formatDuration,
    generateUnifiedReport,
} from "../Logic";
import { RECO_ICON, CATEGORY_LABELS, DAYS, CATEGORIES } from "../constants";
import DayColumn from "./DayColumn";
import ExerciseForm from "./ExerciseForm";
import ReportModal from "./ReportModal";
import ExternalSearch from "./ExternalSearch";
import { isCardioExercise, isStrengthExercise, isFlexibilityExercise } from "../guards";

interface WeekViewProps {
    sessions: DaySession[];
    onUpdateSessions: (sessions: DaySession[]) => void;
}

function emptyForm(category: Exercise['category']): ExerciseFormType {
    switch (category) {
        case 'cardio': return { category: 'cardio', name: '', duration: 0, caloriesBurned: 0 };
        case 'strength': return { category: 'strength', name: '', duration: 0, weight: 0 };
        case 'flexibility': return { category: 'flexibility', name: '', duration: 0, comments: '' };
    }
}

let nextTempSessionId = -1000;

export default function WeekView({ sessions, onUpdateSessions }: WeekViewProps) {
    const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Lunes");
    const [exerciseCategory, setExerciseCategory] = useState<Exercise['category']>('cardio');
    const [formData, setFormData] = useState<ExerciseFormType>(emptyForm('cardio'));
    const [showForm, setShowForm] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [externalInvalid, setExternalInvalid] = useState<InvalidExercise[]>([]);
    const [workoutStatuses, setWorkoutStatuses] = useState<Record<SessionId, WorkoutStatus>>({});
    const [editingWeightId, setEditingWeightId] = useState<ExerciseId | null>(null);
    const [editingWeightValue, setEditingWeightValue] = useState("");

    function handleStartEditWeight(exerciseId: ExerciseId, currentWeight: number) {
        setEditingWeightId(exerciseId);
        setEditingWeightValue(String(currentWeight));
    }

    function handleSaveWeight(sessionId: SessionId, exerciseId: ExerciseId) {
        const newWeight = Number(editingWeightValue);
        if (isNaN(newWeight) || newWeight <= 0) {
            setEditingWeightId(null);
            return;
        }

        const exercise = sessions
            .flatMap(s => s.exercises)
            .find(e => e.id === exerciseId) as StrengthExercise | undefined;

        if (!exercise || exercise.category !== 'strength') return;

        const oldWeight = exercise.weight;
        if (oldWeight === newWeight) {
            setEditingWeightId(null);
            return;
        }

        exerciseStore.update(exerciseId, { weight: newWeight, previousWeight: oldWeight });

        onUpdateSessions(
            sessions.map(s =>
                s.id === sessionId
                    ? {
                        ...s,
                        exercises: s.exercises.map(ex =>
                            ex.id === exerciseId
                                ? { ...ex, weight: newWeight, previousWeight: oldWeight }
                                : ex,
                        ),
                    }
                    : s,
            ),
        );

        setEditingWeightId(null);
    }

    function handleCancelEditWeight() {
        setEditingWeightId(null);
    }

    function getSession(day: DayOfWeek): DaySession | undefined {
        return sessions.find(s => s.day === day);
    }

    function handleToggleCompleted(sessionId: SessionId, exerciseId: ExerciseId) {
        const exercise = sessions.flatMap(s => s.exercises).find(e => e.id === exerciseId);
        if (exercise) {
            exerciseStore.update(exerciseId, { completed: !exercise.completed });
        }

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

    function handleDeleteExercise(sessionId: SessionId, exerciseId: ExerciseId) {
        exerciseStore.deleteById(exerciseId);

        onUpdateSessions(
            sessions.map(s =>
                s.id === sessionId
                    ? { ...s, exercises: s.exercises.filter(ex => ex.id !== exerciseId) }
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

        const storedExercises = exercises.map(({ id, ...data }) => {
            void id;
            return exerciseStore.add(data);
        });

        if (session) {
            updatedSessions = sessions.map(s =>
                s.day === selectedDay
                    ? { ...s, exercises: [...s.exercises, ...storedExercises] }
                    : s,
            );
        } else {
            updatedSessions = [
                ...sessions,
                { id: nextTempSessionId--, day: selectedDay, exercises: storedExercises },
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

    const unifiedReport = useMemo(
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

        const exercise = exerciseStore.add({
            ...formData,
            origin: 'local',
            completed: false,
        });

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
                { id: nextTempSessionId--, day: selectedDay, exercises: [exercise] },
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
                            {RECO_ICON[reco.level]}
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

            <ReportModal
                open={showReport}
                onClose={() => setShowReport(false)}
                allExercises={allExercises}
                apiCount={apiCount}
                unifiedReport={unifiedReport}
            />

            <div className="day-grid">
                {DAYS.map(day => (
                    <DayColumn
                        key={day}
                        day={day}
                        session={getSession(day)}
                        isSelected={selectedDay === day}
                        editingWeightId={editingWeightId}
                        editingWeightValue={editingWeightValue}
                        workoutStatus={workoutStatuses[getSession(day)?.id ?? -1] ?? "pending"}
                        onToggleCompleted={handleToggleCompleted}
                        onDeleteExercise={handleDeleteExercise}
                        onEditNotes={handleEditNotes}
                        onStartEditWeight={handleStartEditWeight}
                        onSaveWeight={handleSaveWeight}
                        onCancelEditWeight={handleCancelEditWeight}
                        onEditWeightValue={setEditingWeightValue}
                        onSetWorkoutStatus={(sessionId, status) =>
                            setWorkoutStatuses(prev => ({ ...prev, [sessionId]: status }))
                        }
                        onOpenForm={openForm}
                    />
                ))}
            </div>

            {showForm && (
                <ExerciseForm
                    selectedDay={selectedDay}
                    exerciseCategory={exerciseCategory}
                    formData={formData}
                    onAdd={handleAddExercise}
                    onCategoryChange={handleCategoryChange}
                    onFormChange={setFormData}
                    onFillFromCatalog={fillFormFromCatalog}
                    onClose={() => setShowForm(false)}
                />
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
