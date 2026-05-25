import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import type {
    User,
    CardioFormData,
    CardioExercise,
    StrengthExercise,
    FlexibilityExercise,
    Exercise,
    ExerciseForm as ExerciseFormType,
    DayPlan,
} from "../Types";
import {
    calculateRoutineTotalCalories,
    calculatePace,
    findLongestExercise,
    findHighestCalorieExercise,
} from "../Logic";
import RegistrationForm from "../components/RegistrationForm";
import UserProfile from "../components/UserProfile";
import ExerciseForm from "../components/ExerciseForm";
import ExerciseSummary from "../components/ExerciseSummary";
import { DEMO_USER, DEMO_ROUTINE } from "../data/demo";

export default function Register() {
    const [step, setStep] = useState(1);

    // ─── Rutina ───
    const [selectedDay, setSelectedDay] = useState<DayPlan['day']>("Lunes");
    const [routineEntries, setRoutineEntries] = useState<DayPlan[]>([]);

    // ─── Formulario de ejercicio: unión discriminada ───
    const [exerciseType, setExerciseType] = useState<Exercise['type']>('cardio');

    const defaultCardioForm = (): CardioFormData => ({
        type: 'cardio', name: '', time: 0, caloriesBurned: 0,
        distance: 0, heartRateZone: '',
    });

    const defaultStrengthForm = (): StrengthExercise => ({
        id: crypto.randomUUID(),
        type: 'strength', name: '', time: 0, caloriesBurned: 0,
        sets: 0, reps: 0, weight: 0,
    });

    const defaultFlexibilityForm = (): FlexibilityExercise => ({
        id: crypto.randomUUID(),
        type: 'flexibility', name: '', time: 0, caloriesBurned: 0,
        poses: 0,
    });

    const [formData, setFormData] = useState<ExerciseFormType>(defaultCardioForm);

    const handleTypeChange = (type: Exercise['type']) => {
        setExerciseType(type);
        switch (type) {
            case 'cardio': setFormData(defaultCardioForm()); break;
            case 'strength': setFormData(defaultStrengthForm()); break;
            case 'flexibility': setFormData(defaultFlexibilityForm()); break;
        }
    };

    // ─── Usuario ───
    const [user, setUser] = useState<User>({
        id: crypto.randomUUID(),
        name: "", age: 0, experienceLevel: "beginner",
        plan: "mensual", startDate: "", isActive: true,
        routine: null,
    });

    // Sincroniza la rutina con el perfil del usuario
    useEffect(() => {
        if (routineEntries.length === 0) return;
        setUser((prev) => ({
            ...prev,
            routine: { id: crypto.randomUUID(), name: "Mi rutina semanal", entries: routineEntries },
        }));
    }, [routineEntries]);

    // ─── Handlers del formulario de usuario ───
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const { name } = target;
        const value = target.type === 'checkbox'
            ? (target as HTMLInputElement).checked
            : target.value;

        setUser((prev) => ({
            ...prev,
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

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

    // ─── Cargar demo ───
    const loadDemo = () => {
        setUser({ ...DEMO_USER, routine: null });
        setRoutineEntries(DEMO_ROUTINE);
        setStep(2);
    };

    // ─── Handler de agregar ejercicio ───
    const handleAddExercise = () => {
        if (!formData.name.trim() || formData.time <= 0 || formData.caloriesBurned <= 0) {
            alert("Completá nombre, duración y calorías del ejercicio");
            return;
        }

        let exercise: Exercise;

        switch (exerciseType) {
            case 'cardio': {
                const cardioForm = formData as CardioFormData;
                exercise = {
                    id: crypto.randomUUID(),
                    ...cardioForm,
                    pace: calculatePace(cardioForm.time, cardioForm.distance),
                } as CardioExercise;
                break;
            }
            case 'strength': {
                exercise = formData as StrengthExercise;
                break;
            }
            case 'flexibility': {
                exercise = formData as FlexibilityExercise;
                break;
            }
        }

        setRoutineEntries((prev) => {
            const existingIndex = prev.findIndex((e) => e.day === selectedDay);
            if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    exercises: [...updated[existingIndex].exercises, exercise],
                };
                return updated;
            }
            return [...prev, { day: selectedDay, exercises: [exercise] }];
        });

        // Resetear formulario
        switch (exerciseType) {
            case 'cardio': setFormData(defaultCardioForm()); break;
            case 'strength': setFormData(defaultStrengthForm()); break;
            case 'flexibility': setFormData(defaultFlexibilityForm()); break;
        }
    };

    // ─── Estadísticas memoizadas ───
    const totalCalories = calculateRoutineTotalCalories(routineEntries);
    const totalDuration = routineEntries.reduce(
        (total, entry) =>
            total + entry.exercises.reduce((sum, ex) => sum + ex.time, 0),
        0
    );
    const longestExercise = findLongestExercise(routineEntries);
    const highestCalorieExercise = findHighestCalorieExercise(routineEntries);

    // ─── Render ───
    return (
        <div className="register-container">
            {step === 1 && (
                <>
                    <RegistrationForm
                        user={user}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                    <button type="button" className="btn-demo" onClick={loadDemo}>
                        ⚡ Cargar demo
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <h1>Agregá tus ejercicios</h1>
                    <h2>Registrá los ejercicios de tu rutina semanal</h2>

                    <UserProfile user={user} />

                    <ExerciseForm
                        selectedDay={selectedDay}
                        exerciseType={exerciseType}
                        formData={formData}
                        onDayChange={setSelectedDay}
                        onTypeChange={handleTypeChange}
                        onFormDataChange={setFormData}
                        onAddExercise={handleAddExercise}
                    />

                    {routineEntries.length > 0 && (
                        <ExerciseSummary
                            routineEntries={routineEntries}
                            totalCalories={totalCalories}
                            totalDuration={totalDuration}
                            longestExercise={longestExercise}
                            highestCalorieExercise={highestCalorieExercise}
                        />
                    )}
                </>
            )}
        </div>
    );
}
