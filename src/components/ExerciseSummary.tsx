import type { Exercise, DaySession } from "../Types";
import {
    calculateCalories,
    calculateAverageCaloriesPerDay,
    formatDuration,
    getExerciseDescription,
} from "../Logic";

interface Props {
    sessions: DaySession[];
    totalCalories: number;
    totalDuration: number;
    longestExercise: Exercise | null;
    highestCalorieExercise: Exercise | null;
}

const CATEGORY_LABELS: Record<string, string> = {
    cardio: "Cardio",
    strength: "Fuerza",
    flexibility: "Flexibilidad",
};

const CATEGORY_ORDER = ["cardio", "strength", "flexibility"];

interface CatalogTotals {
    exercises: number;
    minutes: number;
    calories: number;
}

type Grouped = Record<string, Exercise[]>;

function buildCatalog(sessions: DaySession[]): { grouped: Grouped; totals: CatalogTotals } {
    const grouped: Grouped = {};
    const totals: CatalogTotals = { exercises: 0, minutes: 0, calories: 0 };

    for (const session of sessions) {
        for (const ex of session.exercises) {
            if (!grouped[ex.category]) grouped[ex.category] = [];

            grouped[ex.category].push(ex);
            totals.exercises += 1;
            totals.minutes += ex.duration;
            totals.calories += calculateCalories(ex);
        }
    }

    return { grouped, totals };
}

export default function ExerciseSummary({
    sessions,
    totalCalories,
    totalDuration,
    longestExercise,
    highestCalorieExercise,
}: Props) {
    const { grouped, totals } = buildCatalog(sessions);

    return (
        <section className="exercise-summary">
            <h3>Tu rutina semanal</h3>

            <p className="total-calories">
                <strong>Total de calorías:</strong> {totalCalories} cal
                {" — "}
                <strong>Promedio x día:</strong>{" "}
                {calculateAverageCaloriesPerDay(sessions)} cal
                {" — "}
                <strong>Duración total:</strong> {formatDuration(totalDuration)}
            </p>

            <div className="exercise-stats">
                <p>
                    <strong>Ejercicio más largo:</strong>{" "}
                    {longestExercise
                        ? `${longestExercise.name} (${formatDuration(longestExercise.duration)})`
                        : "—"}
                    {" | "}
                    <strong>Ejercicio más intenso:</strong>{" "}
                    {highestCalorieExercise
                        ? `${highestCalorieExercise.name} (${calculateCalories(highestCalorieExercise)} cal)`
                        : "—"}
                </p>
            </div>

            {CATEGORY_ORDER.map((key) => {
                const exercises = grouped[key];
                if (!exercises) return null;

                const cal = exercises.reduce((s, ex) => s + calculateCalories(ex), 0);
                const dur = exercises.reduce((s, ex) => s + ex.duration, 0);

                return (
                    <div key={key} className="category-block">
                        <h4>
                            {CATEGORY_LABELS[key]} ({exercises.length} ejercicios — {formatDuration(dur)} — {cal} cal)
                        </h4>
                        <ul>
                            {exercises.map((ex, i) => (
                                <li key={i}>
                                    <strong>{ex.name}</strong> —{" "}
                                    {formatDuration(ex.duration)},{" "}
                                    {calculateCalories(ex)} cal
                                    {ex.completed ? " (Completado)" : " (Pendiente)"}
                                    — {getExerciseDescription(ex)}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}

            <div className="catalog-totals">
                <strong>Totales del catálogo:</strong> {totals.exercises} ejercicios — {formatDuration(totals.minutes)} — {totals.calories} cal
            </div>
        </section>
    );
}
