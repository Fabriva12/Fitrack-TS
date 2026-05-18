import type { User } from "../Types";

interface Props {
    user: User;
}

export default function UserProfile({ user }: Props) {
    const levelLabel =
        user.experienceLevel === 'beginner' ? 'Principiante'
        : user.experienceLevel === 'intermediate' ? 'Intermedio'
        : 'Avanzado';

    return (
        <section className="user-profile">
            <h3>Tu perfil</h3>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Edad:</strong> {user.age} años</p>
            <p><strong>Nivel:</strong> {levelLabel}</p>
            <p><strong>Plan:</strong> {user.plan}</p>
            <p><strong>Fecha de inicio:</strong> {user.startDate}</p>
            <p><strong>Estado:</strong> {user.isActive ? 'Activo' : 'Inactivo'}</p>
        </section>
    );
}
