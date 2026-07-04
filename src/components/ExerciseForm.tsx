import type { Exercise, ExerciseForm as ExerciseFormType, DayOfWeek } from "../Types";
import { EXERCISE_CATALOG } from "../data/catalog";
import type { CatalogItem } from "../data/catalog";

interface Props {
    selectedDay: DayOfWeek;
    exerciseCategory: Exercise['category'];
    formData: ExerciseFormType;
    onAdd: () => void;
    onCategoryChange: (category: Exercise['category']) => void;
    onFormChange: (data: ExerciseFormType) => void;
    onFillFromCatalog: (item: CatalogItem) => void;
    onClose: () => void;
}

export default function ExerciseForm({
    selectedDay,
    exerciseCategory,
    formData,
    onAdd,
    onCategoryChange,
    onFormChange,
    onFillFromCatalog,
    onClose,
}: Props) {
    return (
        <div className="add-exercise-section">
            <h3>Agregar ejercicio a {selectedDay}</h3>

            <div className="form-category-select">
                <label>Categoría:
                    <select
                        value={exerciseCategory}
                        onChange={e => onCategoryChange(e.target.value as Exercise['category'])}
                    >
                        <option value="cardio">Cardio</option>
                        <option value="strength">Fuerza</option>
                        <option value="flexibility">Flexibilidad</option>
                    </select>
                </label>
                <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            </div>

            <div className="catalog-grid">
                {EXERCISE_CATALOG
                    .filter(item => item.category === exerciseCategory)
                    .map(item => (
                        <button
                            key={item.id}
                            type="button"
                            className="catalog-item"
                            onClick={() => onFillFromCatalog(item)}
                        >
                            <span className="ci-name">{item.name}</span>
                            <small className="ci-detail">
                                {item.defaultDuration}min
                                {item.defaultCaloriesBurned && ` · ${item.defaultCaloriesBurned}cal`}
                                {item.defaultWeight && ` · ${item.defaultWeight}kg`}
                            </small>
                        </button>
                    ))}
                <button
                    type="button"
                    className="catalog-item custom"
                    onClick={() => onFormChange({
                        category: exerciseCategory,
                        name: '',
                        duration: 0,
                        ...(exerciseCategory === 'cardio' ? { caloriesBurned: 0 } : {}),
                        ...(exerciseCategory === 'strength' ? { weight: 0 } : {}),
                        ...(exerciseCategory === 'flexibility' ? { comments: '' } : {}),
                    } as ExerciseFormType)}
                >
                    <span className="ci-name">Personalizado</span>
                    <small className="ci-detail">Completá los datos manualmente</small>
                </button>
            </div>

            <div className="form-fields">
                <input
                    type="text"
                    placeholder="Nombre del ejercicio"
                    value={formData.name}
                    onChange={e =>
                        onFormChange({ ...formData, name: e.target.value })
                    }
                />
                <input
                    type="number"
                    placeholder="Duración (minutos)"
                    value={formData.duration || ""}
                    onChange={e =>
                        onFormChange({ ...formData, duration: Number(e.target.value) })
                    }
                />
                {exerciseCategory === 'cardio' && (
                    <input
                        type="number"
                        placeholder="Calorías quemadas"
                        value={'caloriesBurned' in formData ? formData.caloriesBurned || "" : ""}
                        onChange={e =>
                            onFormChange({ ...formData, caloriesBurned: Number(e.target.value) })
                        }
                    />
                )}
                {exerciseCategory === 'strength' && (
                    <input
                        type="number"
                        placeholder="Peso levantado (kg)"
                        value={'weight' in formData ? formData.weight || "" : ""}
                        onChange={e =>
                            onFormChange({ ...formData, weight: Number(e.target.value) })
                        }
                    />
                )}
                {exerciseCategory === 'flexibility' && (
                    <input
                        type="text"
                        placeholder="Comentarios (ej: tipo de estiramiento)"
                        value={'comments' in formData ? formData.comments : ""}
                        onChange={e =>
                            onFormChange({ ...formData, comments: e.target.value })
                        }
                    />
                )}
                <button type="button" className="btn-add" onClick={onAdd}>
                    Agregar a {selectedDay}
                </button>
            </div>
        </div>
    );
}
