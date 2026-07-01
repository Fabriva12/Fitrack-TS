import { useSyncExternalStore, useCallback } from "react";
import { Store } from "./Store";

export function useStore<T extends { id: number }>(store: Store<T>) {
  const data = useSyncExternalStore(
    store.subscribe.bind(store),
    store.getSnapshot.bind(store),
  );

  const add = useCallback(
    (entity: Omit<T, "id">) => store.add(entity),
    [store],
  );

  const getById = useCallback(
    (id: number) => store.getById(id),
    [store],
  );

  const update = useCallback(
    (id: number, partial: Partial<T>) => store.update(id, partial),
    [store],
  );

  const deleteById = useCallback(
    (id: number) => store.deleteById(id),
    [store],
  );

  const find = useCallback(
    (predicate: (entity: T) => boolean) => store.find(predicate),
    [store],
  );

  return { data, add, getById, update, deleteById, find };
}
