
import { useState, type FormEvent, type ChangeEvent } from "react";
import type { User, Exercise, DayOfWeek, DayPlan } from "../Types";
import { calculateRoutineTotalCalories, formatDuration, calculatePace, calculateCalories, calculateAverageCaloriesPerWorkoutDay, findHighestCalorieDay } from "../Logic";

export default function Register() {
    const [step, setStep] = useState(1);

    const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Lunes");

    const [routineEntries, setRoutineEntries] = useState<DayPlan[]>([]);

    const [newExercise, setNewExercise] = useState<Exercise>({
        name: "",
        time: 0,
        caloriesBurned: 0,
    });

    const [user, setUser] = useState<User>({
        name: "",
        age: 0,
        experienceLevel: "beginner",
        routine: [],
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]:
                name === "age" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validación básica: edad debe ser > 0 y entera
        if (user.age <= 0 || !Number.isInteger(user.age)) {
            alert("Por favor, ingresá una edad válida (número entero mayor a 0)");
            return;
        }

        if (!user.name.trim()) {
            alert("Por favor, ingresá tu nombre");
            return;
        }

        console.log("Usuario registrado:", user);
        alert("Usuario registrado correctamente");
        setStep(2);
    };

    const handleAddExercise = () => {
        if (!newExercise.name.trim() || newExercise.time <= 0 || newExercise.caloriesBurned <= 0) {
            alert("Completá nombre, duración y calorías del ejercicio");
            return;
        }

        const newEntry: DayPlan = {
            day: selectedDay,
            exercises: [newExercise],
        };

        setRoutineEntries([...routineEntries, newEntry]);

        setNewExercise({ name: "", time: 0, caloriesBurned: 0 });
    };

    return (
        <div className="register-container">
            {step === 1 && (
                <>
                    <h1>Bienvenido a fitrack</h1>
                    <h2>Regístrate para comenzar a planificar tu rutina de ejercicios</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={user.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="age"
                            placeholder="Edad"
                            value={user.age}
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="experienceLevel"
                            value={user.experienceLevel}
                            onChange={handleChange}
                        >
                            <option value="beginner">Principiante</option>
                            <option value="intermediate">Intermedio</option>
                            <option value="advanced">Avanzado</option>
                        </select>

                        <button type="submit">Registrarse</button>
                    </form>
                </>
            )}

            {step === 2 && (
                <>
                    <h1>Agregá tus ejercicios</h1>
                    <h2>Registrá los ejercicios de tu rutina semanal</h2>

                    {/* ——— Perfil del usuario ——— */}
                    <section className="user-profile">
                        <h3>Tu perfil</h3>
                        <p><strong>Nombre:</strong> {user.name}</p>
                        <p><strong>Edad:</strong> {user.age} años</p>
                        <p><strong>Nivel:</strong> {user.experienceLevel === 'beginner' ? 'Principiante' : user.experienceLevel === 'intermediate' ? 'Intermedio' : 'Avanzado'}</p>
                    </section>

                    {/* ——— Formulario de ejercicios ——— */}
                    <form className="exercise-form">
                        <select
                            name="day"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                        >
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>

                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre del ejercicio"
                            value={newExercise.name}
                            onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                            required
                        />

                        <input
                            type="number"
                            name="time"
                            placeholder="Duración (minutos)"
                            value={newExercise.time || ""}
                            onChange={(e) => setNewExercise({ ...newExercise, time: Number(e.target.value) })}
                            required
                        />

                        <input
                            type="number"
                            name="caloriesBurned"
                            placeholder="Calorías por minuto"
                            value={newExercise.caloriesBurned || ""}
                            onChange={(e) => setNewExercise({ ...newExercise, caloriesBurned: Number(e.target.value) })}
                            required
                        />

                        <input
                            type="number"
                            name="distance"
                            placeholder="Distancia (km, opcional)"
                            value={newExercise.distance ?? ""}
                            onChange={(e) => setNewExercise({ ...newExercise, distance: e.target.value ? Number(e.target.value) : undefined })}
                        />

                        <button type="button" onClick={handleAddExercise}>
                            Agregar ejercicio
                        </button>
                    </form>

                    {/* ——— Lista de ejercicios agregados por día ——— */}
                    {routineEntries.length > 0 && (
                        <section className="exercise-summary">
                            <h3>Tu rutina semanal</h3>
                            <p className="total-calories">
                                <strong>🔥 Total de calorías:</strong>{" "}
                                {calculateRoutineTotalCalories(routineEntries)} cal
                                {" — "}
                                <strong>Promedio x día:</strong>{" "}
                                {calculateAverageCaloriesPerWorkoutDay(routineEntries)} cal
                                {" — "}
                                <strong>Día con más calorías:</strong>{" "}
                                {findHighestCalorieDay(routineEntries) ?? "—"}
                                {" — "}
                                <strong>Duración total:</strong>{" "}
                                {formatDuration(
                                    routineEntries.reduce(
                                        (total, entry) =>
                                            total +
                                            entry.exercises.reduce(
                                                (sum, ex) => sum + ex.time,
                                                0
                                            ),
                                        0
                                    )
                                )}
                            </p>
                            {routineEntries.map((entry, index) => (
                                <div key={index} className="day-block">
                                    <h4>{entry.day}</h4>
                                    <ul>
                                        {entry.exercises.map((ex, exIndex) => {
                                            const pace = calculatePace(ex);
                                            return (
                                                <li key={exIndex}>
                                                    <strong>{ex.name}</strong> —{" "}
                                                    {formatDuration(ex.time)},{" "}
                                                    {calculateCalories(ex)} cal
                                                    {ex.distance !== undefined && (
                                                        <> — {ex.distance}km{pace !== null && ` (${pace} min/km)`}</>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </section>
                    )}
                </>
            )}
        </div>
    );
}
