type MemoryEntry = {
  key: string;
  value: string;
};

class MemoryStore {
  private memory: MemoryEntry[] = [];

  add(key: string, value: string) {
    this.memory.push({ key, value });
  }

  search(query: string): MemoryEntry[] {
    const q = query.toLowerCase();

    return this.memory.filter(
      (m) =>
        m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q)
    );
  }

  getAll() {
    return this.memory;
  }
}
export const memoryStore = new MemoryStore();
