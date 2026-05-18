import { createMemo, createSignal, createEffect, For } from 'solid-js'
import DatePill from './DatePill'
import ReminderWidget from './ReminderWidget'
import CreateReminderWidget from './CreateReminderWidget'
import type { Day } from '../Store'
import { snapshotPositions, playFLIP, snapshotForDelete, playDeleteShift, animateIn } from '../utils/flip'

interface DayContainerProps {
  index: number
  day: Day
  appointmentDate: Date
  canMoveUp: boolean
  canMoveDown: boolean
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onAddReminder: () => void
  onRemoveReminder: (reminderIndex: number) => void
  onUpdateReminderTime: (reminderIndex: number, time: number) => void
  onUpdateReminderTitle: (reminderIndex: number, title: string) => void
  onUpdateReminderBody: (reminderIndex: number, body: string) => void
}

const REMINDER_SELECTOR = '[data-reminder-key]'
const reminderKey = (el: Element) => el.getAttribute('data-reminder-key')!
const reminderCoord = (rect: DOMRect) => rect.left

export default function DayContainer(props: DayContainerProps) {
  let reminderRowRef!: HTMLDivElement

  const date = () => {
    const adjustedDate = new Date(props.appointmentDate)
    adjustedDate.setDate(adjustedDate.getDate() - (props.index + 1))
    return adjustedDate
  }

  const [isEditingTime, setIsEditingTime] = createSignal(false)

  const currentSortOrder = createMemo(() =>
    props.day.reminders
      .map((_, reminderIndex) => reminderIndex)
      .sort((indexA, indexB) => props.day.reminders[indexA].time - props.day.reminders[indexB].time)
  )

  const [displayOrder, setDisplayOrder] = createSignal<number[]>(currentSortOrder(), { equals: false })

  createEffect(() => {
    if (!isEditingTime()) setDisplayOrder(currentSortOrder())
  })

  const validDisplayOrder = createMemo(() =>
    displayOrder().filter(i => props.day.reminders[i] !== undefined)
  )

  function handleTimeEditEnd() {
    const before = snapshotPositions(reminderRowRef, REMINDER_SELECTOR, reminderKey)
    setIsEditingTime(false)
    playFLIP(reminderRowRef, REMINDER_SELECTOR, reminderKey, before)
  }

  function handleAddReminder() {
    const before = snapshotPositions(reminderRowRef, REMINDER_SELECTOR, reminderKey)
    const newStoreIndex = props.day.reminders.length
    props.onAddReminder()
    playFLIP(reminderRowRef, REMINDER_SELECTOR, reminderKey, before)
    const newEl = reminderRowRef.querySelector(`[data-reminder-key="${newStoreIndex}"]`) as HTMLElement | null
    if (newEl) animateIn(newEl)
  }

  function handleRemoveReminder(storeIndex: number) {
    const snapshot = snapshotForDelete(reminderRowRef, REMINDER_SELECTOR, String(storeIndex), reminderKey, reminderCoord)
    props.onRemoveReminder(storeIndex)
    if (snapshot) playDeleteShift(reminderRowRef, REMINDER_SELECTOR, snapshot, reminderCoord, 'X')
  }

  return (
    <div class="h-[300px] shrink-0 w-full border border-panel rounded-lg p-2 flex flex-col items-start relative overflow-hidden" data-day-key={props.index}>
      <div class="flex items-center gap-2 w-full">
        <DatePill date={date()} appointmentDate={props.appointmentDate} />
        <div class="flex gap-1.5">
          <button
            class="px-3 py-1 rounded-full border-[1.5px] border-panel bg-transparent text-secondary text-[0.8rem] font-medium cursor-pointer transition-colors duration-150 enabled:hover:border-primary enabled:hover:text-primary enabled:hover:bg-pill disabled:opacity-30 disabled:cursor-default"
            onClick={props.onMoveUp}
            disabled={!props.canMoveUp}
          >
            ↑ Move Up
          </button>
          <button
            class="px-3 py-1 rounded-full border-[1.5px] border-panel bg-transparent text-secondary text-[0.8rem] font-medium cursor-pointer transition-colors duration-150 enabled:hover:border-primary enabled:hover:text-primary enabled:hover:bg-pill disabled:opacity-30 disabled:cursor-default"
            onClick={props.onMoveDown}
            disabled={!props.canMoveDown}
          >
            ↓ Move Down
          </button>
        </div>
      </div>
      <button
        class="absolute top-2 right-2 px-3 py-1 rounded-full border-[1.5px] border-[#c0392b] bg-transparent text-[#c0392b] text-[0.95rem] font-medium cursor-pointer flex items-center gap-[5px] transition-colors duration-150 hover:border-[#e74c3c] hover:text-white hover:bg-[#e74c3c]"
        onClick={props.onRemove}
      >
        <span class="relative -top-px">Delete</span>
        <span>✕</span>
      </button>
      <div class="flex flex-row gap-2 flex-1 w-full mt-2 min-w-0 min-h-0 overflow-x-auto overflow-y-hidden" ref={reminderRowRef}>
        <For each={validDisplayOrder()}>
          {(storeIndex) => (
            <ReminderWidget
              reminderKey={storeIndex}
              time={props.day.reminders[storeIndex].time}
              title={props.day.reminders[storeIndex].title}
              body={props.day.reminders[storeIndex].body}
              onRemove={() => handleRemoveReminder(storeIndex)}
              onTimeChange={(time) => props.onUpdateReminderTime(storeIndex, time)}
              onTitleChange={(title) => props.onUpdateReminderTitle(storeIndex, title)}
              onBodyChange={(body) => props.onUpdateReminderBody(storeIndex, body)}
              onTimeEditStart={() => setIsEditingTime(true)}
              onTimeEditEnd={handleTimeEditEnd}
            />
          )}
        </For>
        <CreateReminderWidget onAdd={handleAddReminder} />
      </div>
    </div>
  )
}
