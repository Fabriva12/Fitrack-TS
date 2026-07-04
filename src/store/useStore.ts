import { useSyncExternalStore } from "react";
import { Store } from "./Store";

export function useStore<T extends { id: number }>(store: Store<T>) {
  const data = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
  );

  return { data };
}
