import { For, Show, createSignal } from 'solid-js'
import { projectsIndexStore } from '../ProjectsIndexStore'
import { appStore } from '../Store'

interface SidebarProps {
  onSwitchProject: (id: string) => void
  onCreateProject: () => void
  onRenameProject: (id: string, title: string) => void
  onDeleteProject: (id: string) => void
}

export default function Sidebar(props: SidebarProps) {
  const [openMenuId, setOpenMenuId] = createSignal<string | null>(null)
  const [renameTargetId, setRenameTargetId] = createSignal<string | null>(null)
  const [renameInputValue, setRenameInputValue] = createSignal('')
  const [deleteTargetId, setDeleteTargetId] = createSignal<string | null>(null)

  function openRenameModal(id: string, currentTitle: string) {
    setOpenMenuId(null)
    setRenameTargetId(id)
    setRenameInputValue(currentTitle)
  }

  function openDeleteModal(id: string) {
    setOpenMenuId(null)
    setDeleteTargetId(id)
  }

  function confirmRename() {
    const id = renameTargetId()
    const trimmedTitle = renameInputValue().trim()
    if (id && trimmedTitle) props.onRenameProject(id, trimmedTitle)
    setRenameTargetId(null)
  }

  function confirmDelete() {
    const id = deleteTargetId()
    if (id) props.onDeleteProject(id)
    setDeleteTargetId(null)
  }

  return (
    <div class="sidebar shrink-0 border-r-2 border-panel bg-surface flex flex-col">
      <div class="px-4 pt-4 pb-3 flex items-center justify-between">
        <span class="text-primary font-semibold text-lg">Projects</span>
        <button
          class="px-2.5 py-1 text-sm font-medium rounded-md bg-btn border border-btn-border text-btn-text cursor-pointer hover:brightness-[0.93] transition"
          onClick={props.onCreateProject}
        >
          New
        </button>
      </div>
      <div class="flex-1 overflow-y-auto px-2 pb-2 flex flex-col gap-1">
        <For each={projectsIndexStore.entries}>
          {(entry) => {
            const isActive = () => entry.id === appStore.id
            const isMenuOpen = () => openMenuId() === entry.id
            return (
              <div
                class="relative flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                classList={{ 'bg-pill': isActive() }}
              >
                <button
                  class="flex-1 text-left text-sm text-primary bg-transparent border-none cursor-pointer py-0.5 truncate"
                  onClick={() => props.onSwitchProject(entry.id)}
                >
                  {entry.title || 'Untitled'}
                </button>
                <button
                  class="shrink-0 flex items-center justify-center bg-transparent border-none cursor-pointer text-muted p-0.5 rounded-md transition-colors hover:text-primary hover:bg-panel"
                  onClick={() => setOpenMenuId(isMenuOpen() ? null : entry.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="currentColor">
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                  </svg>
                </button>
                <Show when={isMenuOpen()}>
                  <div class="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                  <div class="absolute right-0 top-full mt-1 z-20 bg-surface border border-panel rounded-lg shadow-lg overflow-hidden flex flex-col min-w-[140px]">
                    <button
                      class="px-4 py-2 text-sm text-primary text-left bg-transparent border-none cursor-pointer hover:bg-pill transition-colors"
                      onClick={() => openRenameModal(entry.id, entry.title)}
                    >
                      Rename
                    </button>
                    <button
                      class="px-4 py-2 text-sm text-left bg-transparent border-none cursor-pointer text-[#c0392b] hover:bg-[#fdf0ee] transition-colors"
                      onClick={() => openDeleteModal(entry.id)}
                    >
                      Delete
                    </button>
                  </div>
                </Show>
              </div>
            )
          }}
        </For>
      </div>

      <Show when={renameTargetId() !== null}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-surface border border-panel rounded-xl p-6 flex flex-col gap-4 w-[360px] shadow-xl">
            <span class="text-primary font-semibold text-base">Rename Project</span>
            <input
              class="px-3 py-2 rounded-lg border border-panel bg-page text-primary text-sm outline-none focus:border-secondary"
              value={renameInputValue()}
              onInput={(event) => setRenameInputValue(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') confirmRename()
                if (event.key === 'Escape') setRenameTargetId(null)
              }}
              autofocus
            />
            <div class="flex gap-2 justify-end">
              <button
                class="px-4 py-2 text-sm rounded-lg border border-btn-border bg-transparent text-primary cursor-pointer hover:bg-pill transition-colors"
                onClick={() => setRenameTargetId(null)}
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 text-sm rounded-lg bg-btn border border-btn-border text-btn-text cursor-pointer hover:brightness-[0.93] transition"
                onClick={confirmRename}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      </Show>

      <Show when={deleteTargetId() !== null}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div class="bg-surface border border-panel rounded-xl p-6 flex flex-col gap-4 w-[360px] shadow-xl">
            <span class="text-primary font-semibold text-base">Delete Project</span>
            <p class="text-secondary text-sm m-0">This cannot be undone.</p>
            <div class="flex gap-2 justify-end">
              <button
                class="px-4 py-2 text-sm rounded-lg border border-btn-border bg-transparent text-primary cursor-pointer hover:bg-pill transition-colors"
                onClick={() => setDeleteTargetId(null)}
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 text-sm rounded-lg bg-[#c0392b] border border-[#c0392b] text-white cursor-pointer hover:bg-[#e74c3c] hover:border-[#e74c3c] transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
