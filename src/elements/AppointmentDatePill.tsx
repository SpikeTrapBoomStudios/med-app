interface AppointmentDatePillProps {
  date: Date
  onChange: (date: Date) => void
}

function toDisplayDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

function toInputDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export default function AppointmentDatePill(props: AppointmentDatePillProps) {
  let inputRef: HTMLInputElement | undefined

  return (
    <div
      class="inline-flex items-center px-6 py-2.5 rounded-full bg-toggle border-[1.5px] border-panel text-[1.1rem] font-semibold text-primary cursor-pointer select-none relative transition-colors duration-150 hover:bg-pill hover:border-secondary"
      onClick={() => inputRef?.showPicker()}
    >
      <span>Appointment Date: {toDisplayDate(props.date)}</span>
      <input
        ref={inputRef}
        type="date"
        class="absolute bottom-0 left-0 opacity-0 pointer-events-none w-0 h-0"
        value={toInputDate(props.date)}
        onChange={(e) => { if (e.target.value) props.onChange(new Date(e.target.value + 'T00:00:00')) }}
      />
    </div>
  )
}
