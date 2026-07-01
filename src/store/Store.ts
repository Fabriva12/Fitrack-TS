type Listener = () => void;

export class Store<T extends { id: number }> {
  private items: T[] = [];
  private nextId = 1;
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): T[] {
    return this.items;
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  add(data: Omit<T, 'id'>): T {
    const entity = { ...data, id: this.nextId++ } as unknown as T;
    this.items.push(entity);
    this.notify();
    return { ...entity };
  }

  seed(entity: T): void {
    if (entity.id >= this.nextId) {
      this.nextId = entity.id + 1;
    }
    this.items.push(entity);
    this.notify();
  }

  getAll(): T[] {
    return this.items.map(item => ({ ...item }));
  }

  getById(id: number): T | undefined {
    const item = this.items.find(item => item.id === id);
    return item ? { ...item } : undefined;
  }

  deleteById(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    this.notify();
    return true;
  }

  update(id: number, partial: Partial<T>): T | undefined {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    this.items[index] = { ...this.items[index], ...partial, id };
    this.notify();
    return { ...this.items[index] };
  }

  find(predicate: (entity: T) => boolean): T[] {
    return this.items.filter(predicate).map(item => ({ ...item }));
  }
}
