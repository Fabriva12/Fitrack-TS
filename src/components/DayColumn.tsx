import type { DaySession, DayOfWeek, ExerciseId, SessionId, WorkoutStatus } from "../Types";
import { calculateSessionDuration } from "../Logic";
import { CATEGORY_LABELS } from "../constants";
import { getExerciseDescription } from "../Logic";

interface Props {
    day: DayOfWeek;
    session: DaySession | undefined;
    isSelected: boolean;
    editingWeightId: ExerciseId | null;
    editingWeightValue: string;
    workoutStatus: WorkoutStatus;
    onToggleCompleted: (sessionId: SessionId, exerciseId: ExerciseId) => void;
    onDeleteExercise: (sessionId: SessionId, exerciseId: ExerciseId) => void;
    onEditNotes: (sessionId: SessionId, notes: string) => void;
    onStartEditWeight: (exerciseId: ExerciseId, currentWeight: number) => void;
    onSaveWeight: (sessionId: SessionId, exerciseId: ExerciseId) => void;
    onCancelEditWeight: () => void;
    onEditWeightValue: (value: string) => void;
    onSetWorkoutStatus: (sessionId: SessionId, status: WorkoutStatus) => void;
    onOpenForm: (day: DayOfWeek) => void;
}

export default function DayColumn({
    day,
    session,
    isSelected,
    editingWeightId,
    editingWeightValue,
    workoutStatus,
    onToggleCompleted,
    onDeleteExercise,
    onEditNotes,
    onStartEditWeight,
    onSaveWeight,
    onCancelEditWeight,
    onEditWeightValue,
    onSetWorkoutStatus,
    onOpenForm,
}: Props) {
    const dayDuration = session ? calculateSessionDuration(session) : 0;
    const completedCount = session
        ? session.exercises.filter(e => e.completed).length
        : 0;

    return (
        <div
            className={`day-column ${isSelected ? 'active' : ''} ${session ? 'has-session' : ''}`}
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
                        className={`status-btn ${workoutStatus === "pending" ? "active" : ""}`}
                        onClick={() => onSetWorkoutStatus(session.id, "pending")}
                    >Pendiente</button>
                    <button
                        className={`status-btn ${workoutStatus === "completed" ? "active" : ""}`}
                        onClick={() => onSetWorkoutStatus(session.id, "completed")}
                    >Completado</button>
                    <button
                        className={`status-btn ${workoutStatus === "skipped" ? "active" : ""}`}
                        onClick={() => onSetWorkoutStatus(session.id, "skipped")}
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
                                    onChange={() => onToggleCompleted(session.id, ex.id)}
                                />
                                <span className="ex-name">{ex.name}</span>
                                <span className="ex-status">{ex.completed ? '✅' : '❌'}</span>
                                <button
                                    className="btn-delete-ex"
                                    onClick={() => onDeleteExercise(session.id, ex.id)}
                                    title="Eliminar ejercicio"
                                >✕</button>
                            </div>
                            <div className="ex-details">
                                <span className={`ex-category cat-${ex.category}`}>
                                    {CATEGORY_LABELS[ex.category]}
                                </span>
                                <span className="ex-duration">{ex.duration}min</span>
                                {ex.category === "strength" ? (
                                    editingWeightId === ex.id
                                        ? (
                                            <span className="ex-weight-edit">
                                                <input
                                                    type="number"
                                                    className="weight-input"
                                                    value={editingWeightValue}
                                                    min="0"
                                                    autoFocus
                                                    onChange={e => onEditWeightValue(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") onSaveWeight(session.id, ex.id);
                                                        if (e.key === "Escape") onCancelEditWeight();
                                                    }}
                                                    onBlur={() => onSaveWeight(session.id, ex.id)}
                                                />
                                                <span className="weight-unit">kg</span>
                                            </span>
                                        )
                                        : (
                                            <span
                                                className="ex-weight"
                                                onClick={() => onStartEditWeight(ex.id, ex.weight)}
                                                title="Editar peso"
                                            >
                                                {ex.weight} kg
                                            </span>
                                        )
                                ) : (
                                    <span className="ex-desc">{getExerciseDescription(ex)}</span>
                                )}
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
                    onChange={e => onEditNotes(session.id, e.target.value)}
                    rows={2}
                />
            )}
            <button
                className="btn-add-day"
                onClick={() => onOpenForm(day)}
            >
                + Agregar
            </button>
        </div>
    );
}
