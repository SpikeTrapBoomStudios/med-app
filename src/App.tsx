import { createEffect, untrack } from 'solid-js'
import { reconcile } from 'solid-js/store'
import './App.css'
import ThemeToggle from './elements/ThemeToggle'
import Sidebar from './elements/Sidebar'
import CenterPanel from './elements/CenterPanel'
import AppointmentDatePill from './elements/AppointmentDatePill'
import {
  appStore, setAppStore,
  addDay, removeDay, moveDayUp, moveDayDown,
  addReminder, removeReminder,
  updateReminderTime, updateReminderTitle, updateReminderBody,
  setProjectTitle,
} from './Store'
import { BrowserLocalStorage, generateProjectId } from './Storage'
import {
  projectsIndexStore,
  setProjectsIndexEntries,
  putInProjectsIndex,
  removeFromProjectsIndex,
} from './ProjectsIndexStore'

const storage = new BrowserLocalStorage()

function parseStoredDate(value: unknown): Date {
  const date = new Date(value as string)
  return isNaN(date.getTime()) ? new Date() : date
}

const savedIndex = storage.loadIndex()
setProjectsIndexEntries(savedIndex)

const lastActiveId = storage.loadLastActiveId()
const targetId = lastActiveId ?? savedIndex[0]?.id ?? null
let projectLoaded = false

if (targetId) {
  const dataString = storage.loadProjectData(targetId)
  if (dataString) {
    try {
      const parsedData = JSON.parse(dataString)
      setAppStore(reconcile({
        id: targetId,
        title: parsedData.title ?? '',
        appointmentDate: parseStoredDate(parsedData.appointmentDate),
        days: parsedData.days ?? {},
      }))
      projectLoaded = true
    } catch {}
  }
}

if (!projectLoaded) {
  const id = generateProjectId()
  const indexEntry = { id, title: 'New Project' }
  setAppStore('id', id)
  setAppStore('title', 'New Project')
  setAppStore('appointmentDate', new Date())
  addDay()
  addDay()
  addDay()
  const newIndex = [...savedIndex, indexEntry]
  storage.saveIndex(newIndex)
  storage.saveLastActiveId(id)
  setProjectsIndexEntries(newIndex)
}

export default function App() {
  createEffect(() => {
    const id = appStore.id
    if (!id) return
    const data = JSON.stringify({
      title: appStore.title,
      appointmentDate: appStore.appointmentDate.toISOString(),
      days: appStore.days,
    })
    storage.saveProjectData(id, data)
    storage.saveLastActiveId(id)
    untrack(() => {
      putInProjectsIndex({ id, title: appStore.title })
      storage.saveIndex(projectsIndexStore.entries)
    })
  })

  function handleSwitchProject(id: string) {
    if (id === appStore.id) return
    const dataString = storage.loadProjectData(id)
    if (!dataString) {
      removeFromProjectsIndex(id)
      storage.saveIndex(projectsIndexStore.entries)
      return
    }
    try {
      const parsedData = JSON.parse(dataString)
      setAppStore(reconcile({
        id,
        title: parsedData.title ?? '',
        appointmentDate: parseStoredDate(parsedData.appointmentDate),
        days: parsedData.days ?? {},
      }))
      storage.saveLastActiveId(id)
    } catch { /* corrupted data */ }
  }

  function handleCreateProject() {
    const id = generateProjectId()
    const indexEntry = { id, title: 'New Project' }
    setAppStore(reconcile({ id, title: 'New Project', appointmentDate: new Date(), days: {} }))
    addDay()
    addDay()
    addDay()
    putInProjectsIndex(indexEntry)
    storage.saveIndex(projectsIndexStore.entries)
    storage.saveLastActiveId(id)
  }

  function handleRenameProject(id: string, title: string) {
    if (id === appStore.id) {
      setProjectTitle(title)
      return
    }
    const dataString = storage.loadProjectData(id)
    if (!dataString) return
    try {
      const parsedData = JSON.parse(dataString)
      storage.saveProjectData(id, JSON.stringify({ ...parsedData, title }))
      putInProjectsIndex({ id, title })
      storage.saveIndex(projectsIndexStore.entries)
    } catch {}
  }

  function handleDeleteProject(id: string) {
    if (projectsIndexStore.entries.length <= 1) return
    const needsSwitch = id === appStore.id
    const nextEntry = needsSwitch
      ? projectsIndexStore.entries.find(entry => entry.id !== id)
      : null
    storage.deleteProjectData(id)
    removeFromProjectsIndex(id)
    storage.saveIndex(projectsIndexStore.entries)
    if (needsSwitch && nextEntry) handleSwitchProject(nextEntry.id)
  }

  return (
    <div class="flex flex-col h-screen bg-page text-primary transition-colors duration-200">
      <div class="relative flex items-center justify-center px-6 py-3 bg-surface border-b border-panel shrink-0 transition-colors duration-200">
        <span class="text-primary font-semibold text-xl">Bowel Prep Instructions Creator</span>
        <div class="absolute right-6">
          <ThemeToggle />
        </div>
      </div>
      <div class="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          onSwitchProject={handleSwitchProject}
          onCreateProject={handleCreateProject}
          onRenameProject={handleRenameProject}
          onDeleteProject={handleDeleteProject}
        />
        <div class="flex flex-1 min-h-0 min-w-0 flex-col justify-center items-center gap-6 pt-9 pr-[32px] pb-[54px] pl-[32px]">
          <AppointmentDatePill
            date={appStore.appointmentDate}
            onChange={(date) => setAppStore('appointmentDate', date)}
          />
          <CenterPanel
            days={appStore.days}
            appointmentDate={appStore.appointmentDate}
            onAddDay={addDay}
            onRemoveDay={removeDay}
            onMoveDayUp={moveDayUp}
            onMoveDayDown={moveDayDown}
            onAddReminder={addReminder}
            onRemoveReminder={removeReminder}
            onUpdateReminderTime={updateReminderTime}
            onUpdateReminderTitle={updateReminderTitle}
            onUpdateReminderBody={updateReminderBody}
          />
          <button class="px-16 py-3 text-base font-medium cursor-pointer border-[1.5px] border-btn-border rounded-lg bg-btn text-btn-text transition hover:brightness-[0.93]">
            Generate QR Code
          </button>
        </div>
      </div>
    </div>
  )
}
