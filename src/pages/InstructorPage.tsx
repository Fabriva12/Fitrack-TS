import { useMemo } from "react";
import InstructorDashboard from "../components/InstructorDashboard";
import { userStore, getDemoInstructor, useStore } from "../store";

export default function InstructorPage() {
  const instructor = useMemo(() => getDemoInstructor(), []);
  const { data: users } = useStore(userStore);

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
