import { useState, type FormEvent, type ChangeEvent } from "react";
import type { User, DaySession } from "../Types";
import RegistrationForm from "../components/RegistrationForm";
import UserProfile from "../components/UserProfile";
import WeekView from "../components/WeekView";
import { DEMO_USER, DEMO_ROUTINE } from "../data/demo";
import { userStore, exerciseStore } from "../store";
import { nextId } from "../store/id";

function buildRoutine(sessions: DaySession[]) {
    if (sessions.length === 0) return null;
    return {
        id: nextId(),
        name: "Mi rutina semanal",
        startDate: new Date().toISOString().split('T')[0],
        sessions,
    };
}

export default function Register() {
    const [step, setStep] = useState(1);
    const [sessions, setSessions] = useState<DaySession[]>([]);

    const [user, setUser] = useState<User>({
        id: nextId(),
        name: "", age: 0, email: "",
        experienceLevel: "beginner",
        routine: null,
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    const handleUpdateSessions = (newSessions: DaySession[]) => {
        setSessions(newSessions);
        setUser((prev) => ({
            ...prev,
            routine: buildRoutine(newSessions),
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
        if (!user.email.trim()) {
            alert("Por favor, ingresá tu email");
            return;
        }

        userStore.add(user);
        console.log("Usuario registrado:", user);
        alert("Usuario registrado correctamente");
        setStep(2);
    };

    const loadDemo = () => {
        const routine = buildRoutine(DEMO_ROUTINE);
        const fullUser = { ...DEMO_USER, routine };
        userStore.seed(fullUser);
        for (const s of DEMO_ROUTINE) {
            for (const ex of s.exercises) {
                exerciseStore.seed(ex);
            }
        }
        setUser(fullUser);
        setSessions(DEMO_ROUTINE);
        setStep(2);
    };

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
                        Cargar demo
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <h1>Armá tu rutina semanal</h1>
                    <UserProfile user={user} />
                    <WeekView
                        sessions={sessions}
                        onUpdateSessions={handleUpdateSessions}
                    />
                </>
            )}
        </div>
    );
}
