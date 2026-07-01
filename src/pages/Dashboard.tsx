import { useMemo } from "react";
import { Link } from "react-router-dom";
import { userStore, exerciseStore } from "../store";
import {
  calculateRestRecommendation,
  calculateRoutineDuration,
  calculateRoutineCalories,
  formatDuration,
} from "../Logic";
import type { ExperienceLevel } from "../Types";
import { isCardioExercise, isStrengthExercise, isFlexibilityExercise } from "../guards";

const LEVEL_LABEL: Record<ExperienceLevel, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

const RECO_ICON = {
  low: "⚠️",
  moderate: "✅",
  high: "🔴",
} as const;

export default function Dashboard() {
  const users = useMemo(() => userStore.getAll(), []);
  const exercises = useMemo(() => exerciseStore.getAll(), []);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.routine && u.routine.sessions.length > 0).length;
  const localCount = exercises.filter(e => e.origin === "local").length;
  const apiCount = exercises.filter(e => e.origin === "api").length;

  const cardioCount = exercises.filter(isCardioExercise).length;
  const strengthCount = exercises.filter(isStrengthExercise).length;
  const flexibilityCount = exercises.filter(isFlexibilityExercise).length;

  const recentActivity = useMemo(() => {
    const activity: { icon: string; text: string }[] = [];

    for (const user of users) {
      if (!user.routine) continue;
      for (const session of user.routine.sessions) {
        for (const ex of session.exercises) {
          if (ex.completed) {
            activity.push({
              icon: "✅",
              text: `${ex.name} completado, ${user.name}`,
            });
          }
          if (ex.category === "strength" && ex.weight > 0) {
            activity.push({
              icon: "✅",
              text: `${ex.name} actualizado, ${user.name} (${ex.weight} kg)`,
            });
          }
        }
      }
    }

    return activity.slice(0, 10);
  }, [users]);

  return (
    <div className="instructor-page">
      <div className="instructor-dashboard">
        <header className="instructor-header">
          <h1>FitTracker — Dashboard</h1>
        </header>

        <section className="dash-section">
          <h2 className="dash-section-title">📦 Estado del sistema</h2>
          <div className="dash-stat-list">
            <div className="dash-stat-line">
              <span className="dash-stat-key">Usuarios:</span>
              <span className="dash-stat-val">{totalUsers}</span>
            </div>
            <div className="dash-stat-line">
              <span className="dash-stat-key">Ejercicios en catálogo:</span>
              <span className="dash-stat-val">{exercises.length}</span>
              <span className="dash-stat-detail">({localCount} locales + {apiCount} desde API)</span>
            </div>
            <div className="dash-stat-line">
              <span className="dash-stat-key">Rutinas activas:</span>
              <span className="dash-stat-val">{activeUsers}</span>
            </div>
          </div>
        </section>

        {activeUsers > 0 && (
          <section className="dash-section">
            <div className="dash-user-cards">
              {users.filter(u => u.routine && u.routine.sessions.length > 0).map(user => {
                const sessions = user.routine!.sessions;
                const reco = calculateRestRecommendation(sessions);
                const totalDuration = calculateRoutineDuration(sessions);
                const totalCalories = calculateRoutineCalories(sessions);

                return (
                  <div key={user.id} className="dash-user-line">
                    <div className="dash-user-head">
                      👤 {user.name} <span className="user-level">{LEVEL_LABEL[user.experienceLevel]}</span>
                    </div>
                    <div className="dash-user-meta">
                      {user.routine!.name}, {sessions.length} días | {formatDuration(totalDuration)} | {totalCalories} kcal
                    </div>
                    <div className={`dash-user-reco reco-${reco.level}`}>
                      Carga: {RECO_ICON[reco.level]} {reco.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="dash-section">
          <h2 className="dash-section-title">📊 Catálogo</h2>
          <div className="dash-cat-row">
            <span className="dash-cat-item">🏃 Cardio: {cardioCount}</span>
            <span className="dash-cat-item">💪 Fuerza: {strengthCount}</span>
            <span className="dash-cat-item">🧘 Flexibilidad: {flexibilityCount}</span>
          </div>
        </section>

        <section className="dash-section">
          <h2 className="dash-section-title">🗄️ Actividad reciente</h2>
          <div className="dash-activity-list">
            {recentActivity.length === 0 && (
              <p className="dash-activity-empty">Sin actividad registrada.</p>
            )}
            {recentActivity.map((item, i) => (
              <div key={i} className="dash-activity-item">
                <span className="dash-activity-icon">{item.icon}</span>
                <span className="dash-activity-text">{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="dash-nav-row">
          <Link to="/register" className="dash-nav-card">
            <span className="dash-nav-text">Registro de usuario</span>
            <span className="dash-nav-arrow">{'>'}</span>
          </Link>
          <Link to="/instructor" className="dash-nav-card">
            <span className="dash-nav-text">Panel del instructor</span>
            <span className="dash-nav-arrow">{'>'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
