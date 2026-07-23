import type { User } from "../Types";
import { LEVEL_LABEL } from "../constants";

interface Props {
    user: User;
}

export default function UserProfile({ user }: Props) {
    return (
        <section className="user-profile">
            <h3>Tu perfil</h3>
            <p>
                {user.name} — {user.age} años — {user.email}
                <br />
                Nivel {LEVEL_LABEL[user.experienceLevel]}
            </p>
        </section>
    );
}
