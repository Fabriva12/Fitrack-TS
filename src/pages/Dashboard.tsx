import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { userStore, exerciseStore, routineStore, sessionStore, useStore } from "../store";
import {
  calculateRestRecommendation,
  calculateRoutineDuration,
  calculateRoutineCalories,
  formatDuration,
} from "../Logic";
import type { DaySession, StrengthExercise } from "../Types";
import { isCardioExercise, isStrengthExercise, isFlexibilityExercise } from "../guards";
import { LEVEL_LABEL, RECO_ICON } from "../constants";

function getUserSessions(routineId: number | null): DaySession[] {
  if (!routineId) return [];
  const routine = routineStore.getById(routineId);
  if (!routine) return [];
  return routine.sessionIds
    .map(id => sessionStore.getById(id))
    .filter((s): s is DaySession => s !== undefined);
}

function deleteUser(userId: number): void {
  const user = userStore.getById(userId);
  if (!user) return;

  if (user.routineId) {
    const routine = routineStore.getById(user.routineId);
    if (routine) {
      for (const sessionId of routine.sessionIds) {
        const session = sessionStore.getById(sessionId);
        if (session) {
          for (const ex of session.exercises) {
            exerciseStore.deleteById(ex.id);
          }
        }
        sessionStore.deleteById(sessionId);
      }
    }
    routineStore.deleteById(user.routineId);
  }

  userStore.deleteById(userId);
}

export default function Dashboard() {
  const { data: allUsers } = useStore(userStore);
  const { data: exercises } = useStore(exerciseStore);
  const { data: routines } = useStore(routineStore);

  const [search, setSearch] = useState("");

  const activeRoutineCount = routines.filter(r => r.sessionIds.length > 0).length;

  const users = search
    ? userStore.find(u => u.name.toLowerCase().includes(search.toLowerCase()))
    : allUsers;

  const totalUsers = users.length;
  const localCount = exercises.filter(e => e.origin === "local").length;
  const apiCount = exercises.filter(e => e.origin === "api").length;

  const cardioCount = exercises.filter(isCardioExercise).length;
  const strengthCount = exercises.filter(isStrengthExercise).length;
  const flexibilityCount = exercises.filter(isFlexibilityExercise).length;

  const recentActivity = useMemo(() => {
    const activity: { icon: string; text: string }[] = [];

    for (const user of allUsers) {
      const sessions = getUserSessions(user.routineId);
      for (const session of sessions) {
        for (const ex of session.exercises) {
          if (ex.completed) {
            activity.push({
              icon: "✅",
              text: `${ex.name} completado, ${user.name}`,
            });
          }
            if (ex.category === "strength") {
            const stored = exerciseStore.getById(ex.id) as StrengthExercise | undefined;
            if (stored?.previousWeight !== undefined && stored.previousWeight !== stored.weight) {
              activity.push({
                icon: "✅",
                text: `${ex.name} actualizado, ${user.name} (${stored.previousWeight} → ${stored.weight} kg)`,
              });
            }
          }
        }
      }
    }

    return activity.slice(0, 10);
  }, [allUsers]);

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
              <span className="dash-stat-val">{activeRoutineCount}</span>
            </div>
          </div>
        </section>

        {activeRoutineCount > 0 && (
          <section className="dash-section">
            <div className="dash-search">
              <input
                type="text"
                placeholder="Buscar usuario por nombre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="dash-search-input"
              />
            </div>
            <div className="dash-user-cards">
              {users.filter(u => getUserSessions(u.routineId).length > 0).map(user => {
                const routine = routineStore.getById(user.routineId!);
                const sessions = getUserSessions(user.routineId);
                const reco = calculateRestRecommendation(sessions);
                const totalDuration = calculateRoutineDuration(sessions);
                const totalCalories = calculateRoutineCalories(sessions);

                return (
                  <div key={user.id} className="dash-user-line">
                    <div className="dash-user-head">
                      <div>
                        <span className="dash-user-name">{user.name}</span>
                        <span className="user-level">{LEVEL_LABEL[user.experienceLevel]}</span>
                      </div>
                      <button
                        className="btn-delete-user"
                        onClick={() => deleteUser(user.id)}
                        title="Eliminar usuario"
                      >✕</button>
                    </div>
                    <div className="dash-user-meta">
                      {routine!.name}, {sessions.length} días | {formatDuration(totalDuration)} | {totalCalories} kcal
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
