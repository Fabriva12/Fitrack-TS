import type { Exercise, UnifiedReport } from "../Types";
import { CATEGORY_LABELS, CATEGORIES } from "../constants";
import { getExerciseDescription } from "../Logic";

interface Props {
    open: boolean;
    onClose: () => void;
    allExercises: Exercise[];
    apiCount: number;
    unifiedReport: UnifiedReport;
}

export default function ReportModal({ open, onClose, allExercises, apiCount, unifiedReport }: Props) {
    if (!open) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Reporte unificado</h3>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="report-summary">
                        <span className="rs-total">
                            Total ejercicios: {allExercises.length}
                        </span>
                        <span className="rs-local">
                            Locales: {allExercises.length - apiCount}
                        </span>
                        <span className="rs-api">
                            API: {apiCount}
                        </span>
                    </div>
                    {CATEGORIES.map(cat => {
                        const exercises = unifiedReport.byCategory[cat];
                        if (!exercises || exercises.length === 0) return null;
                        const totalMin = exercises.reduce((s, e) => s + e.duration, 0);
                        return (
                            <div key={cat} className="report-category">
                                <h4 className={`${cat}-header`}>{CATEGORY_LABELS[cat]} ({exercises.length})</h4>
                                <p className="report-total">{totalMin} min totales</p>
                                <ul className="report-list">
                                    {exercises.map(e => (
                                        <li key={e.id} className="report-item">
                                            <span className="ri-name">{e.name}</span>
                                            <span className={`ri-source ${e.origin === 'api' ? 'external' : 'local'}`}>
                                                {e.origin === 'api' ? 'API' : 'Local'}
                                            </span>
                                            <span className="ri-duration">{e.duration}min</span>
                                            <span className="ri-desc">{getExerciseDescription(e)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                    {unifiedReport.invalid.length > 0 && (
                        <div className="report-invalid">
                            <h4>Ejercicios con datos incompletos ({unifiedReport.invalid.length})</h4>
                            <ul className="report-invalid-list">
                                {unifiedReport.invalid.map((inv, i) => (
                                    <li key={i} className="report-invalid-item">
                                        <span className="ri-name">{inv.data.name || "Sin nombre"}</span>
                                        <span className="ri-reason">{inv.reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {unifiedReport.invalid.length === 0 &&
                        Object.keys(unifiedReport.byCategory).length === 0 && (
                        <p className="report-empty">No hay ejercicios para mostrar.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
