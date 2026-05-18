export type ProjectIndexEntry = {
  id: string
  title: string
}

export interface StorageProvider {
  loadIndex(): ProjectIndexEntry[]
  saveIndex(entries: ProjectIndexEntry[]): void
  loadProjectData(id: string): string | null
  saveProjectData(id: string, data: string): void
  deleteProjectData(id: string): void
  loadLastActiveId(): string | null
  saveLastActiveId(id: string): void
}

export class BrowserLocalStorage implements StorageProvider {
  private static readonly INDEX_KEY = 'index'
  private static readonly LAST_ACTIVE_KEY = 'lastActive'

  loadIndex(): ProjectIndexEntry[] {
    try {
      const raw = localStorage.getItem(BrowserLocalStorage.INDEX_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.filter(entry => typeof entry?.id === 'string' && typeof entry?.title === 'string')
    } catch {
      return []
    }
  }

  saveIndex(entries: ProjectIndexEntry[]): void {
    localStorage.setItem(BrowserLocalStorage.INDEX_KEY, JSON.stringify(entries))
  }

  loadProjectData(id: string): string | null {
    return localStorage.getItem(id)
  }

  saveProjectData(id: string, data: string): void {
    localStorage.setItem(id, data)
  }

  deleteProjectData(id: string): void {
    localStorage.removeItem(id)
  }

  loadLastActiveId(): string | null {
    return localStorage.getItem(BrowserLocalStorage.LAST_ACTIVE_KEY)
  }

  saveLastActiveId(id: string): void {
    localStorage.setItem(BrowserLocalStorage.LAST_ACTIVE_KEY, id)
  }
}

export function generateProjectId(): string {
  return crypto.randomUUID()
}
