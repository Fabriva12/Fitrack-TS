import { useMemo } from "react";
import InstructorDashboard from "../components/InstructorDashboard";
import { userStore, getDemoInstructor } from "../store";

export default function InstructorPage() {
  const instructor = useMemo(() => getDemoInstructor(), []);
  const users = useMemo(() => userStore.getAll(), []);

  if (!instructor) {
    return <p>No hay datos de instructor disponibles.</p>;
  }

  return (
    <div className="instructor-page">
      <InstructorDashboard
        instructor={instructor}
        users={users}
      />
    </div>
  );
}
