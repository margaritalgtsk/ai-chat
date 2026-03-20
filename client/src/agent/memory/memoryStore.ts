type MemoryEntry = {
  key: string;
  value: string;
};

class MemoryStore {
  private storageKey = 'agent_memory';
  private memory: MemoryEntry[] = [];

  constructor() {
    this.memory = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.memory));
  }

  add(key: string, value: string) {
    this.memory.push({ key, value });
    this.save();
  }

  search(query: string): MemoryEntry[] {
    //const q = query.toLowerCase();
    const tokens = query.toLowerCase().split(/\s+/);

    /*     return this.memory.filter(
      (m) =>
        m.key.toLowerCase().includes(q) || m.value.toLowerCase().includes(q)
    ); */
    return this.memory.filter((m) => {
      const text = `${m.key} ${m.value}`.toLowerCase();

      return tokens.some((t) => text.includes(t));
    });
  }

  getAll() {
    console.log(localStorage.getItem(this.storageKey));
    console.log(JSON.parse(localStorage.getItem(this.storageKey) || '[]'));
    return this.memory;
  }
}
export const memoryStore = new MemoryStore();
