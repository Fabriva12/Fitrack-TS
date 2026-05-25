import type { Dispatch, SetStateAction } from "react";
import type {
    DayOfWeek,
    Exercise,
    CardioFormData,
    StrengthExercise,
    FlexibilityExercise,
    ExerciseForm,
} from "../Types";

interface Props {
    selectedDay: DayOfWeek;
    exerciseType: Exercise['type'];
    formData: ExerciseForm;
    onDayChange: (day: DayOfWeek) => void;
    onTypeChange: (type: Exercise['type']) => void;
    onFormDataChange: Dispatch<SetStateAction<ExerciseForm>>;
    onAddExercise: () => void;
}

export default function ExerciseForm({
    selectedDay,
    exerciseType,
    formData,
    onDayChange,
    onTypeChange,
    onFormDataChange,
    onAddExercise,
}: Props) {
    const updateField = (field: string, value: string | number) => {
        onFormDataChange(prev => ({ ...prev, [field]: value } as ExerciseForm));
    };

    return (
        <form className="exercise-form">
            {/* Día de la semana */}
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

            {/* Tipo de ejercicio */}
            <select
                value={exerciseType}
                onChange={(e) => onTypeChange(e.target.value as Exercise['type'])}
            >
                <option value="cardio">Cardio</option>
                <option value="strength">Fuerza</option>
                <option value="flexibility">Flexibilidad</option>
            </select>

            {/* Campos comunes a TODOS los tipos */}
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
                value={formData.time || ""}
                onChange={(e) => updateField('time', Number(e.target.value))}
                required
            />

            <input
                type="number"
                placeholder="Calorías por minuto"
                value={formData.caloriesBurned || ""}
                onChange={(e) => updateField('caloriesBurned', Number(e.target.value))}
                required
            />

            {/* ─── Campos específicos por tipo ─── */}
            {exerciseType === 'cardio' && (
                <>
                    <input
                        type="number"
                        placeholder="Distancia (km)"
                        value={(formData as CardioFormData).distance || ""}
                        onChange={(e) => updateField('distance', Number(e.target.value))}
                    />
                    <input
                        type="text"
                        placeholder="Zona de frecuencia cardíaca (ej: Z2, Z3, Z4)"
                        value={(formData as CardioFormData).heartRateZone}
                        onChange={(e) => updateField('heartRateZone', e.target.value)}
                    />
                </>
            )}

            {exerciseType === 'strength' && (
                <>
                    <input
                        type="number"
                        placeholder="Series"
                        value={(formData as StrengthExercise).sets || ""}
                        onChange={(e) => updateField('sets', Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Repeticiones por serie"
                        value={(formData as StrengthExercise).reps || ""}
                        onChange={(e) => updateField('reps', Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="Peso (kg)"
                        value={(formData as StrengthExercise).weight || ""}
                        onChange={(e) => updateField('weight', Number(e.target.value))}
                    />
                </>
            )}

            {exerciseType === 'flexibility' && (
                <input
                    type="number"
                    placeholder="Poses / posiciones"
                    value={(formData as FlexibilityExercise).poses || ""}
                    onChange={(e) => updateField('poses', Number(e.target.value))}
                />
            )}

            <button type="button" onClick={onAddExercise}>
                Agregar ejercicio
            </button>
        </form>
    );
}
