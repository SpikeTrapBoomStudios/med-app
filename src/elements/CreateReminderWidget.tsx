interface CreateReminderWidgetProps {
  onAdd: () => void
}

export default function CreateReminderWidget(props: CreateReminderWidgetProps) {
  return (
    <div
      class="w-[360px] shrink-0 h-full border-2 border-dashed border-create rounded-lg relative flex flex-col items-center justify-center gap-2 cursor-pointer text-create-text transition-colors duration-150 hover:border-secondary hover:text-secondary"
      data-reminder-key="add"
      onClick={props.onAdd}
    >
      <span class="text-[2.2rem] leading-none font-light">+</span>
      <span class="text-[0.85rem] font-medium">New Reminder</span>
    </div>
  )
}
