import type { Exercise, DayPlan } from "../Types";
import {
    calculateCalories,
    calculatePercentageOfTotal,
    calculateAverageCaloriesPerWorkoutDay,
    findHighestCalorieDay,
    formatDuration,
} from "../Logic";

interface Props {
    routineEntries: DayPlan[];
    totalCalories: number;
    totalDuration: number;
    longestExercise: Exercise | null;
    highestCalorieExercise: Exercise | null;
}

export default function ExerciseSummary({
    routineEntries,
    totalCalories,
    totalDuration,
    longestExercise,
    highestCalorieExercise,
}: Props) {
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

            {routineEntries.map((entry) => (
                <div key={entry.day} className="day-block">
                    <h4>{entry.day}</h4>
                    <ul>
                        {entry.exercises.map((ex, exIndex) => (
                            <li key={exIndex}>
                                <strong>{ex.name}</strong> —{" "}
                                {formatDuration(ex.time)},{" "}
                                {calculateCalories(ex)} cal
                                {" ("}
                                {calculatePercentageOfTotal(ex, totalCalories)}
                                {"%)"}

                                {/* Type narrowing: cada tipo muestra sus props específicas */}
                                {ex.type === 'cardio' && (
                                    <> — {ex.distance}km (ritmo {ex.pace} min/km, {ex.heartRateZone})</>
                                )}
                                {ex.type === 'strength' && (
                                    <> — {ex.sets} series x {ex.reps} reps @ {ex.weight}kg</>
                                )}
                                {ex.type === 'flexibility' && (
                                    <> — 🧘 {ex.poses} poses</>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </section>
    );
}
