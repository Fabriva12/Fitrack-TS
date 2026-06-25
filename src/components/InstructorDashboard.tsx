import type { Instructor, User, ExperienceLevel, RestLevel } from "../Types";
import {
    calculateWeeklyLoad,
    calculateRestRecommendation,
    calculateRoutineDuration,
    calculateRoutineCalories,
    formatDuration,
} from "../Logic";

interface Props {
    instructor: Instructor;
    users: User[];
}

const LEVEL_LABEL: Record<ExperienceLevel, string> = {
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado",
};

const DAYS: readonly string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const RECO_ICON: Record<RestLevel, string> = {
    low: "⚠️",
    moderate: "✅",
    high: "🔴",
};

function DayIndicator({ sessions }: { sessions: string[] }) {
    return (
        <div className="day-indicator">
            {DAYS.map(d => (
                <span
                    key={d}
                    className={`day-dot ${sessions.includes(d) ? 'active' : ''}`}
                    title={d}
                >
                    {d[0]}
                </span>
            ))}
        </div>
    );
}

export default function InstructorDashboard({ instructor, users }: Props) {
    const trainingUsers = users.filter(u => u.routine && u.routine.sessions.length > 0);
    const inactiveUsers = users.filter(u => !u.routine || u.routine.sessions.length === 0);

    return (
        <section className="instructor-dashboard">
            <header className="instructor-header">
                <h2>Panel del Instructor</h2>
                <p className="instructor-info">
                    {instructor.name} · {instructor.email}
                </p>
                <p className="instructor-count">
                    {users.length} usuarios asignados
                    {trainingUsers.length > 0 && ` · ${trainingUsers.length} con rutina activa`}
                </p>
            </header>

            <div className="user-cards">
                {trainingUsers.map(user => {
                    const sessions = user.routine!.sessions;
                    const load = calculateWeeklyLoad(sessions);
                    const reco = calculateRestRecommendation(sessions);
                    const totalDuration = calculateRoutineDuration(sessions);
                    const totalCalories = calculateRoutineCalories(sessions);
                    const totalExercises = sessions.reduce((s, ses) => s + ses.exercises.length, 0);
                    const completedExercises = sessions.reduce(
                        (s, ses) => s + ses.exercises.filter(e => e.completed).length,
                        0,
                    );
                    const sessionDays = sessions.map(s => s.day);

                    return (
                        <div key={user.id} className="user-card">
                            <div className="user-card-header">
                                <div>
                                    <h3>{user.name}</h3>
                                    <span className="user-level">{LEVEL_LABEL[user.experienceLevel]}</span>
                                </div>
                                <span className="user-email">{user.email}</span>
                            </div>

                            <DayIndicator sessions={sessionDays} />

                            <div className="user-card-stats">
                                <div className="stat-box">
                                    <span className="stat-value">{sessions.length}/7</span>
                                    <span className="stat-label">Días activos</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-value">{formatDuration(totalDuration)}</span>
                                    <span className="stat-label">Duración total</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-value">{totalCalories}</span>
                                    <span className="stat-label">Calorías</span>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-value">{completedExercises}/{totalExercises}</span>
                                    <span className="stat-label">Ejercicios</span>
                                </div>
                            </div>

                            <div className="category-breakdown">
                                <span className="cat-bar cardio" style={{ width: `${(load.cardioMinutes / load.totalMinutes) * 100}%` }}>
                                    {load.cardioMinutes > 0 && `${formatDuration(load.cardioMinutes)}`}
                                </span>
                                <span className="cat-bar strength" style={{ width: `${(load.strengthMinutes / load.totalMinutes) * 100}%` }}>
                                    {load.strengthMinutes > 0 && `${formatDuration(load.strengthMinutes)}`}
                                </span>
                                <span className="cat-bar flexibility" style={{ width: `${(load.flexibilityMinutes / load.totalMinutes) * 100}%` }}>
                                    {load.flexibilityMinutes > 0 && `${formatDuration(load.flexibilityMinutes)}`}
                                </span>
                            </div>

                            <p className={`reco reco-${reco.level}`}>
                                {RECO_ICON[reco.level]} {reco.message}
                            </p>

                            <details className="user-card-sessions">
                                <summary>Ver sesiones ({sessions.length})</summary>
                                {sessions.map(s => (
                                    <div key={s.id} className="session-row">
                                        <span className="session-day">{s.day}</span>
                                        <span className="session-exercises">
                                            {s.exercises.map(e => (
                                                <span key={e.id} className={`session-ex ${e.completed ? 'done' : ''}`}>
                                                    {e.name} ({e.duration}min)
                                                </span>
                                            ))}
                                        </span>
                                        {s.notes && <span className="session-note">📝 {s.notes}</span>}
                                    </div>
                                ))}
                            </details>
                        </div>
                    );
                })}
            </div>

            {inactiveUsers.length > 0 && (
                <div className="inactive-section">
                    <h3>Usuarios sin rutina ({inactiveUsers.length})</h3>
                    <ul>
                        {inactiveUsers.map(u => (
                            <li key={u.id}>{u.name} — {u.email}</li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
