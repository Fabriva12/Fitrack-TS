import { type FormEvent, type ChangeEvent } from "react";
import type { User } from "../Types";
import { LEVEL_LABEL } from "../constants";

interface Props {
    user: User;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent) => void;
}

export default function RegistrationForm({ user, onChange, onSubmit }: Props) {
    return (
        <>
            <h1>Bienvenido a FitTrack</h1>
            <h2>Registrate para comenzar a planificar tu rutina de ejercicios</h2>

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

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={onChange}
                    required
                />

                <select
                    name="experienceLevel"
                    value={user.experienceLevel}
                    onChange={onChange}
                >
                    {Object.entries(LEVEL_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <button type="submit">Registrarse</button>
            </form>
        </>
    );
}
