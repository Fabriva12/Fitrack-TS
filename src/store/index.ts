import { Store } from "./Store";
import type { User, Exercise, Instructor } from "../Types";
import { getDemoInstructorData } from "../data/demo";

export const userStore = new Store<User>();
export const exerciseStore = new Store<Exercise>();

let _demoInstructor: Instructor | null = null;

export function getDemoInstructor(): Instructor | null {
  return _demoInstructor ? { ..._demoInstructor } : null;
}

export function initDemoData(): void {
  const { instructor, users } = getDemoInstructorData();
  _demoInstructor = instructor;

  for (const user of users) {
    userStore.seed(user);
    if (user.routine) {
      for (const session of user.routine.sessions) {
        for (const ex of session.exercises) {
          exerciseStore.seed(ex);
        }
      }
    }
  }
}
