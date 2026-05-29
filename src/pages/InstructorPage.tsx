import { useMemo } from "react";
import InstructorDashboard from "../components/InstructorDashboard";
import { getDemoInstructorData } from "../data/demo";

export default function InstructorPage() {
    const data = useMemo(() => getDemoInstructorData(), []);

    return (
        <div className="instructor-page">
            <InstructorDashboard
                instructor={data.instructor}
                users={data.users}
            />
        </div>
    );
}
