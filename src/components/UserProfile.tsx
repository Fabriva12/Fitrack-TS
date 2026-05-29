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
            <p>
                {user.name} — {user.age} años — {user.email}
                <br />
                Nivel {levelLabel}
            </p>
        </section>
    );
}
