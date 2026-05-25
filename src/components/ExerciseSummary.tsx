import type { Exercise, DayPlan } from "../Types";
import {
    calculateCalories,
    calculatePercentageOfTotal,
    calculateAverageCaloriesPerWorkoutDay,
    findHighestCalorieDay,
    formatDuration,
    getExerciseDescription,
} from "../Logic";

interface Props {
    routineEntries: DayPlan[];
    totalCalories: number;
    totalDuration: number;
    longestExercise: Exercise | null;
    highestCalorieExercise: Exercise | null;
}

const CATEGORY_LABELS: Record<string, string> = {
    cardio: "Cardio",
    strength: "Fuerza",
    flexibilidad: "Flexibilidad",
};

const CATEGORY_ORDER = ["cardio", "strength", "flexibilidad"];

interface CatalogTotals {
    exercises: number;
    minutes: number;
    calories: number;
}

type Grouped = Record<string, Exercise[]>;

function buildCatalog(entries: DayPlan[]): { grouped: Grouped; totals: CatalogTotals } {
    const grouped: Grouped = {};
    const totals: CatalogTotals = { exercises: 0, minutes: 0, calories: 0 };

    for (const entry of entries) {
        for (const ex of entry.exercises) {
            const key = ex.type === "flexibility" ? "flexibilidad" : ex.type;
            if (!grouped[key]) grouped[key] = [];

            grouped[key].push(ex);
            totals.exercises += 1;
            totals.minutes += ex.time;
            totals.calories += calculateCalories(ex);
        }
    }

    return { grouped, totals };
}

export default function ExerciseSummary({
    routineEntries,
    totalCalories,
    totalDuration,
    longestExercise,
    highestCalorieExercise,
}: Props) {
    const { grouped, totals } = buildCatalog(routineEntries);

    return (
        <section className="exercise-summary">
            <h3>Tu rutina semanal</h3>

            <p className="total-calories">
                <strong>🔥 Total de calorías:</strong> {totalCalories} cal
                {" — "}
                <strong>Promedio x día:</strong>{" "}
                {calculateAverageCaloriesPerWorkoutDay(routineEntries)} cal
                {" — "}
                <strong>Día con más calorías:</strong>{" "}
                {findHighestCalorieDay(routineEntries) ?? "—"}
                {" — "}
                <strong>Duración total:</strong> {formatDuration(totalDuration)}
            </p>

            <div className="exercise-stats">
                <p>
                    <strong>🏋️ Ejercicio más largo:</strong>{" "}
                    {longestExercise
                        ? `${longestExercise.name} (${formatDuration(longestExercise.time)})`
                        : "—"}
                    {" | "}
                    <strong>🔥 Ejercicio más intenso:</strong>{" "}
                    {highestCalorieExercise
                        ? `${highestCalorieExercise.name} (${calculateCalories(highestCalorieExercise)} cal)`
                        : "—"}
                </p>
            </div>

            {CATEGORY_ORDER.map((key) => {
                const exercises = grouped[key];
                if (!exercises) return null;

                const cal = exercises.reduce((s, ex) => s + calculateCalories(ex), 0);
                const dur = exercises.reduce((s, ex) => s + ex.time, 0);

                return (
                    <div key={key} className="category-block">
                        <h4>
                            {CATEGORY_LABELS[key]} ({exercises.length} ejercicios — {formatDuration(dur)} — {cal} cal)
                        </h4>
                        <ul>
                            {exercises.map((ex, i) => (
                                <li key={i}>
                                    <strong>{ex.name}</strong> —{" "}
                                    {formatDuration(ex.time)},{" "}
                                    {calculateCalories(ex)} cal
                                    {" ("}
                                    {calculatePercentageOfTotal(ex, totalCalories)}
                                    {"%)"}

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
