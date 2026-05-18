import { createSignal, createEffect } from 'solid-js'

type Theme = 'light' | 'dark'
const THEMES: Theme[] = ['light', 'dark']

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>('light')

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', theme())
  })

  return (
    <div class="flex bg-toggle rounded-full p-[3px] gap-0.5 z-[100]">
      {THEMES.map(optionTheme => (
        <button
          class={`px-3.5 py-1.5 border-none rounded-full text-[0.8rem] cursor-pointer transition-colors duration-150 ${
            theme() === optionTheme
              ? 'bg-toggle-active text-toggle-active-text font-semibold'
              : 'bg-transparent text-toggle-text'
          }`}
          onClick={() => setTheme(optionTheme)}
        >
          {optionTheme.charAt(0).toUpperCase() + optionTheme.slice(1)}
        </button>
      ))}
    </div>
  )
}
