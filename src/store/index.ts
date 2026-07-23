import { Store } from "./Store";
import type { User, Exercise, Instructor, WeeklyRoutine, DaySession } from "../Types";
import { getDemoInstructorData } from "../data/demo";

export { useStore } from "./useStore";

export const userStore = new Store<User>();
export const exerciseStore = new Store<Exercise>();
export const routineStore = new Store<WeeklyRoutine>();
export const sessionStore = new Store<DaySession>();

let _demoInstructor: Instructor | null = null;

export function getDemoInstructor(): Instructor | null {
  return _demoInstructor ? { ..._demoInstructor } : null;
}

export function initDemoData(): void {
  const { instructor, users, routines, sessions } = getDemoInstructorData();
  _demoInstructor = instructor;

  for (const session of sessions) {
    sessionStore.seed(session);
    for (const ex of session.exercises) {
      exerciseStore.seed(ex);
    }
  }

  for (const routine of routines) {
    routineStore.seed(routine);
  }

  for (const user of users) {
    userStore.seed(user);
  }
}
