import { createStore, reconcile } from 'solid-js/store'

export type Reminder = {
  time: number
  title: string
  body: string
}

export type Day = {
  reminders: Reminder[]
}

export type AppState = {
  id: string
  title: string
  appointmentDate: Date
  days: Record<number, Day>
}

const [appStore, setAppStore] = createStore<AppState>({
  id: '',
  title: '',
  appointmentDate: new Date(),
  days: {},
})

function dayCount(): number {
  return Object.keys(appStore.days).length
}

function dayExists(index: number): boolean {
  return appStore.days[index] !== undefined
}

function reminderExists(dayIndex: number, reminderIndex: number): boolean {
  return dayExists(dayIndex) && appStore.days[dayIndex].reminders[reminderIndex] !== undefined
}

function recompactDays(days: Record<number, Day>): Record<number, Day> {
  const recompacted: Record<number, Day> = {}
  Object.values(days).forEach((day, newIndex) => {
    recompacted[newIndex] = { reminders: day.reminders.map(reminder => ({ ...reminder })) }
  })
  return recompacted
}

export function addDay() {
  setAppStore('days', dayCount(), { reminders: [] })
}

export function removeDay(index: number) {
  if (!dayExists(index)) return
  const remaining: Record<number, Day> = {}
  Object.entries(appStore.days).forEach(([key, day]) => {
    if (Number(key) !== index) remaining[Number(key)] = day
  })
  setAppStore('days', reconcile(recompactDays(remaining)))
}

export function canMoveDayUp(index: number) {
  return index !== 0
}

export function canMoveDayDown(index: number) {
  return index !== dayCount() - 1
}

export function moveDayUp(index: number) {
  if (!canMoveDayUp(index) || !dayExists(index) || !dayExists(index - 1)) return
  const dayAtIndex = { reminders: appStore.days[index].reminders.map(reminder => ({ ...reminder })) }
  const dayAbove   = { reminders: appStore.days[index - 1].reminders.map(reminder => ({ ...reminder })) }
  setAppStore('days', reconcile({ ...appStore.days, [index]: dayAbove, [index - 1]: dayAtIndex }))
}

export function moveDayDown(index: number) {
  if (!canMoveDayDown(index) || !dayExists(index) || !dayExists(index + 1)) return
  const dayAtIndex = { reminders: appStore.days[index].reminders.map(reminder => ({ ...reminder })) }
  const dayBelow   = { reminders: appStore.days[index + 1].reminders.map(reminder => ({ ...reminder })) }
  setAppStore('days', reconcile({ ...appStore.days, [index]: dayBelow, [index + 1]: dayAtIndex }))
}

export function addReminder(dayIndex: number) {
  if (!dayExists(dayIndex)) return
  const currentReminders = appStore.days[dayIndex].reminders.map(reminder => ({ ...reminder }))
  setAppStore('days', dayIndex, 'reminders', [...currentReminders, { time: 1200, title: '', body: '' }])
}

export function removeReminder(dayIndex: number, reminderIndex: number) {
  if (!reminderExists(dayIndex, reminderIndex)) return
  const updated = appStore.days[dayIndex].reminders.filter((_, index) => index !== reminderIndex)
  setAppStore('days', dayIndex, 'reminders', updated)
}

export function updateReminderTime(dayIndex: number, reminderIndex: number, time: number) {
  if (!reminderExists(dayIndex, reminderIndex)) return
  setAppStore('days', dayIndex, 'reminders', reminderIndex, 'time', time)
}

export function updateReminderTitle(dayIndex: number, reminderIndex: number, title: string) {
  if (!reminderExists(dayIndex, reminderIndex)) return
  setAppStore('days', dayIndex, 'reminders', reminderIndex, 'title', title)
}

export function updateReminderBody(dayIndex: number, reminderIndex: number, body: string) {
  if (!reminderExists(dayIndex, reminderIndex)) return
  setAppStore('days', dayIndex, 'reminders', reminderIndex, 'body', body)
}

export function setProjectTitle(title: string) {
  setAppStore('title', title)
}

export { appStore, setAppStore }
