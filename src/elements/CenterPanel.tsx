import { For } from 'solid-js'
import DayContainer from './DayContainer'
import type { Day } from '../Store'
import { playSwap, snapshotForDelete, playDeleteShift, animateIn } from '../utils/flip'

interface CenterPanelProps {
  days: Record<number, Day>
  appointmentDate: Date
  onAddDay: () => void
  onRemoveDay: (dayIndex: number) => void
  onMoveDayUp: (dayIndex: number) => void
  onMoveDayDown: (dayIndex: number) => void
  onAddReminder: (dayIndex: number) => void
  onRemoveReminder: (dayIndex: number, reminderIndex: number) => void
  onUpdateReminderTime: (dayIndex: number, reminderIndex: number, time: number) => void
  onUpdateReminderTitle: (dayIndex: number, reminderIndex: number, title: string) => void
  onUpdateReminderBody: (dayIndex: number, reminderIndex: number, body: string) => void
}

export default function CenterPanel(props: CenterPanelProps) {
  let containerRef!: HTMLDivElement

  const indices = () => Object.keys(props.days).map(Number).sort((a, b) => a - b)
  const dayCount = () => indices().length

  const DAY_SELECTOR = '[data-day-key]'
  const getDayKey = (el: Element) => el.getAttribute('data-day-key')!
  const getDayCoord = (rect: DOMRect) => rect.top

  function getDayEl(index: number) {
    return containerRef.querySelector(`[data-day-key="${index}"]`) as HTMLElement | null
  }

  function animatedMoveDayUp(dayIndex: number) {
    const elA = getDayEl(dayIndex - 1)
    const elB = getDayEl(dayIndex)
    props.onMoveDayUp(dayIndex)
    if (elA && elB) playSwap(elA, elB)
  }

  function animatedMoveDayDown(dayIndex: number) {
    const elA = getDayEl(dayIndex)
    const elB = getDayEl(dayIndex + 1)
    props.onMoveDayDown(dayIndex)
    if (elA && elB) playSwap(elA, elB)
  }

  function animatedAddDay() {
    const newIndex = Object.keys(props.days).length
    props.onAddDay()
    const newEl = containerRef.querySelector(`[data-day-key="${newIndex}"]`) as HTMLElement | null
    if (newEl) animateIn(newEl)
  }

  function animatedRemoveDay(dayIndex: number) {
    const snapshot = snapshotForDelete(containerRef, DAY_SELECTOR, String(dayIndex), getDayKey, getDayCoord)
    props.onRemoveDay(dayIndex)
    if (snapshot) playDeleteShift(containerRef, DAY_SELECTOR, snapshot, getDayCoord, 'Y')
  }

  return (
    <div
      class="w-full flex-1 min-h-0 border-2 border-panel rounded-xl bg-surface flex flex-col gap-3 p-4 overflow-y-auto transition-colors duration-200"
      ref={containerRef}
    >
      <For each={indices()}>
        {(index) => (
          <DayContainer
            index={index}
            day={props.days[index]}
            appointmentDate={props.appointmentDate}
            canMoveUp={index !== 0}
            canMoveDown={index !== dayCount() - 1}
            onRemove={() => animatedRemoveDay(index)}
            onMoveUp={() => animatedMoveDayUp(index)}
            onMoveDown={() => animatedMoveDayDown(index)}
            onAddReminder={() => props.onAddReminder(index)}
            onRemoveReminder={(reminderIndex) => props.onRemoveReminder(index, reminderIndex)}
            onUpdateReminderTime={(reminderIndex, time) => props.onUpdateReminderTime(index, reminderIndex, time)}
            onUpdateReminderTitle={(reminderIndex, title) => props.onUpdateReminderTitle(index, reminderIndex, title)}
            onUpdateReminderBody={(reminderIndex, body) => props.onUpdateReminderBody(index, reminderIndex, body)}
          />
        )}
      </For>
      <div
        class="h-[100px] shrink-0 w-full border-2 border-dashed border-create rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer text-create-text transition-colors duration-150 hover:border-secondary hover:text-secondary"
        onClick={animatedAddDay}
      >
        <span class="text-[1.6rem] leading-none font-light">+</span>
        <span class="text-[0.85rem] font-medium">New Day</span>
      </div>
    </div>
  )
}
