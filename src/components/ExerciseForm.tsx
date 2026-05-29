import type { Dispatch, SetStateAction } from "react";
import type {
    DayOfWeek,
    Exercise,
    ExerciseForm,
} from "../Types";

interface Props {
    selectedDay: DayOfWeek;
    exerciseCategory: Exercise['category'];
    formData: ExerciseForm;
    onDayChange: (day: DayOfWeek) => void;
    onCategoryChange: (category: Exercise['category']) => void;
    onFormDataChange: Dispatch<SetStateAction<ExerciseForm>>;
    onAddExercise: () => void;
}

export default function ExerciseForm({
    selectedDay,
    exerciseCategory,
    formData,
    onDayChange,
    onCategoryChange,
    onFormDataChange,
    onAddExercise,
}: Props) {
    const updateField = (field: string, value: string | number) => {
        onFormDataChange(prev => ({ ...prev, [field]: value } as ExerciseForm));
    };

    return (
        <form className="exercise-form">
            <select
                value={selectedDay}
                onChange={(e) => onDayChange(e.target.value as DayOfWeek)}
            >
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
            </select>

            <select
                value={exerciseCategory}
                onChange={(e) => onCategoryChange(e.target.value as Exercise['category'])}
            >
                <option value="cardio">Cardio</option>
                <option value="strength">Fuerza</option>
                <option value="flexibility">Flexibilidad</option>
            </select>

            <input
                type="text"
                placeholder="Nombre del ejercicio"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Duración (minutos)"
                value={formData.duration || ""}
                onChange={(e) => updateField('duration', Number(e.target.value))}
                required
            />

            {exerciseCategory === 'cardio' && (
                <input
                    type="number"
                    placeholder="Calorías quemadas"
                    value={(formData as Extract<ExerciseForm, { category: 'cardio' }>).caloriesBurned || ""}
                    onChange={(e) => updateField('caloriesBurned', Number(e.target.value))}
                    required
                />
            )}

            {exerciseCategory === 'strength' && (
                <input
                    type="number"
                    placeholder="Peso levantado (kg)"
                    value={(formData as Extract<ExerciseForm, { category: 'strength' }>).weight || ""}
                    onChange={(e) => updateField('weight', Number(e.target.value))}
                    required
                />
            )}

            {exerciseCategory === 'flexibility' && (
                <input
                    type="text"
                    placeholder="Comentarios (ej: tipo de estiramiento)"
                    value={(formData as Extract<ExerciseForm, { category: 'flexibility' }>).comments}
                    onChange={(e) => updateField('comments', e.target.value)}
                />
            )}

            <button type="button" onClick={onAddExercise}>
                Agregar ejercicio
            </button>
        </form>
    );
}
