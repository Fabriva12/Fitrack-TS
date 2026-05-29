import { type FormEvent, type ChangeEvent } from "react";
import type { User } from "../Types";

interface Props {
    user: User;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function RegistrationForm({ user, onChange, onSubmit }: Props) {
    return (
        <>
            <h1>Bienvenido a fitrack</h1>
            <h2>Regístrate para comenzar a planificar tu rutina de ejercicios</h2>

            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={user.name}
                    onChange={onChange}
                    required
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Edad"
                    value={user.age}
                    onChange={onChange}
                    required
                />

                <select
                    name="experienceLevel"
                    value={user.experienceLevel}
                    onChange={onChange}
                >
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                </select>

                {/* ——— Membresía ——— */}
                <select
                    name="plan"
                    value={user.plan}
                    onChange={onChange}
                    required
                >
                    <option value="" disabled>Seleccioná un plan</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                </select>

                <input
                    type="date"
                    name="startDate"
                    value={user.startDate}
                    onChange={onChange}
                    required
                />

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={user.isActive}
                        onChange={onChange}
                    />
                    Membresía activa
                </label>

                <button type="submit">Registrarse</button>
            </form>
        </>
    );
}
