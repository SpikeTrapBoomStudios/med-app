import { createStore } from 'solid-js/store'
import type { ProjectIndexEntry } from './Storage'

const [projectsIndexStore, setProjectsIndexStore] = createStore<{ entries: ProjectIndexEntry[] }>({
  entries: [],
})

export function setProjectsIndexEntries(entries: ProjectIndexEntry[]): void {
  setProjectsIndexStore('entries', [...entries])
}

export function putInProjectsIndex(entry: ProjectIndexEntry): void {
  const existingIndex = projectsIndexStore.entries.findIndex(existing => existing.id === entry.id)
  if (existingIndex === -1) {
    setProjectsIndexStore('entries', projectsIndexStore.entries.length, entry)
  } else {
    setProjectsIndexStore('entries', existingIndex, entry)
  }
}

export function removeFromProjectsIndex(id: string): void {
  setProjectsIndexStore('entries', projectsIndexStore.entries.filter(entry => entry.id !== id))
}

export { projectsIndexStore }
