interface ReminderWidgetProps {
  reminderKey: number
  time: number
  title: string
  body: string
  onRemove: () => void
  onTimeChange: (time: number) => void
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onTimeEditStart: () => void
  onTimeEditEnd: () => void
}

function toInputTime(time: number): string {
  const hours = String(Math.floor(time / 100)).padStart(2, '0')
  const minutes = String(time % 100).padStart(2, '0')
  return `${hours}:${minutes}`
}

export default function ReminderWidget(props: ReminderWidgetProps) {
  function handleTimeChange(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.value) {
      props.onTimeChange(parseInt(input.value.replace(':', '')))
    }
  }

  return (
    <div class="w-[360px] shrink-0 h-full border-[2.5px] border-widget rounded-lg relative flex flex-col" data-reminder-key={props.reminderKey}>
      <button
        class="absolute top-2 right-2 w-[22px] h-[22px] rounded-full border-[1.5px] border-[#c0392b] bg-transparent text-[#c0392b] text-[0.95rem] leading-none flex items-center justify-center p-0 cursor-pointer transition-colors duration-150 hover:border-[#e74c3c] hover:text-white hover:bg-[#e74c3c]"
        onClick={props.onRemove}
      >
        ✕
      </button>
      <div class="flex flex-col gap-1.5 p-2.5 flex-1 min-h-0">
        <input
          type="time"
          class="reminder-time-pill inline-flex items-center px-[11px] py-[3.3px] rounded-full bg-pill text-[0.88rem] font-semibold text-primary border-none outline-none cursor-text w-fit"
          value={toInputTime(props.time)}
          onFocus={props.onTimeEditStart}
          onBlur={props.onTimeEditEnd}
          onChange={handleTimeChange}
        />
        <input
          type="text"
          class="reminder-title-pill inline-flex items-center px-[11px] py-[3.3px] rounded-full bg-pill text-[0.88rem] text-secondary border-none outline-none cursor-text w-fit min-w-[80px]"
          value={props.title}
          placeholder="Reminder Name"
          onInput={(e) => props.onTitleChange((e.target as HTMLInputElement).value)}
        />
        <textarea
          class="reminder-notes-pill px-[11px] py-1.5 rounded-xl bg-pill text-[0.88rem] text-secondary border-none outline-none cursor-text flex-1 w-[calc(100%-22px)]"
          placeholder="Reminder text..."
          onInput={(e) => props.onBodyChange((e.target as HTMLTextAreaElement).value)}
        >{props.body}</textarea>
      </div>
    </div>
  )
}
