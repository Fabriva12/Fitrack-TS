import { useState, type FormEvent, type ChangeEvent } from "react";
import type { User, DaySession } from "../Types";
import RegistrationForm from "../components/RegistrationForm";
import UserProfile from "../components/UserProfile";
import WeekView from "../components/WeekView";
import { DEMO_USER, DEMO_ROUTINE } from "../data/demo";
import { userStore, exerciseStore, routineStore, sessionStore } from "../store";

export default function Register() {
    const [step, setStep] = useState(1);
    const [sessions, setSessions] = useState<DaySession[]>([]);

    const [user, setUser] = useState<User>({
        id: -1,
        name: "", age: 0, email: "",
        experienceLevel: "beginner",
        routineId: null,
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

        const routineId = sessions.length > 0 ? (() => {
            const storedSessionIds = sessions.map(s => sessionStore.add({
                day: s.day,
                exercises: s.exercises,
                notes: s.notes,
            }).id);
            const routine = routineStore.add({
                name: "Mi rutina semanal",
                startDate: new Date().toISOString().split('T')[0],
                sessionIds: storedSessionIds,
            });
            return routine.id;
        })() : null;

        const { id: userId, ...userData } = user;
        void userId;
        const storedUser = userStore.add({ ...userData, routineId });
        setUser(storedUser);
        console.log("Usuario registrado:", storedUser);
        alert("Usuario registrado correctamente");
        setStep(2);
    };

    const loadDemo = () => {
        for (const s of DEMO_ROUTINE) {
            sessionStore.seed(s);
            for (const ex of s.exercises) {
                exerciseStore.seed(ex);
            }
        }
        const routine = routineStore.add({
            name: "Mi rutina semanal",
            startDate: new Date().toISOString().split('T')[0],
            sessionIds: DEMO_ROUTINE.map(s => s.id),
        });
        const fullUser = { ...DEMO_USER, routineId: routine.id };
        userStore.seed(fullUser);
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
