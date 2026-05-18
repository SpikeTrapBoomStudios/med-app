interface DatePillProps {
  date: Date
  appointmentDate: Date
}

export default function DatePill(props: DatePillProps) {
  const daysBeforeAppointment = () => {
    const msPerDay = 1000 * 60 * 60 * 24
    return Math.round((props.appointmentDate.getTime() - props.date.getTime()) / msPerDay)
  }

  const formattedDate = () => {
    const month = props.date.getMonth() + 1
    const day = props.date.getDate()
    const year = props.date.getFullYear()
    return `${month}/${day}/${year}`
  }

  return (
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pill text-[0.92rem] font-medium text-primary">
      <span>{daysBeforeAppointment()} {daysBeforeAppointment() === 1 ? 'Day' : 'Days'} Before Appointment</span>
      <span class="text-muted">-</span>
      <span class="text-secondary">{formattedDate()}</span>
    </div>
  )
}
