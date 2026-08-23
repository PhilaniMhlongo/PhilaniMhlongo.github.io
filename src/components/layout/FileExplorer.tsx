import { ChevronLeft, ChevronRight } from "lucide-react"
import { getFileIcon } from "../file/FileIcon"
import { useTerminal } from "../../hooks/useTerminal"

type ReturnTypeOfUseTerminal = ReturnType<typeof useTerminal>

interface Props {
  terminal: ReturnTypeOfUseTerminal
}

export const FileExplorer = ({ terminal }: Props) => {
  const items = terminal.getCurrentDirectory()
  const atRoot = terminal.currentPath.length === 0

  return (
    <nav
      className="flex h-full flex-col overflow-hidden rounded border border-border bg-surface"
      aria-label="File explorer"
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
        <span className="md-label font-bold">files</span>
        <span className="ml-auto truncate text-2xs text-text-tertiary">
          ~/{terminal.currentPath.join("/")}
        </span>
      </div>

      {/* Keyed on the path so changing directory replays the entry
          stagger, which makes the navigation legible. */}
      <div key={terminal.currentPath.join("/")} className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {!atRoot && (
          <button
            onClick={() =>
              terminal.setCurrentPath(terminal.currentPath.slice(0, -1))
            }
            className="row-in press-row mb-0.5 flex min-h-[44px] w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-text-tertiary hover:bg-surface-hover hover:text-text-primary sm:min-h-0"
          >
            <ChevronLeft className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="font-mono text-[0.8125rem]">..</span>
          </button>
        )}

        {items.map((item, index) => {
          const isActive = terminal.selectedFile?.name === item.name
          return (
            <button
              key={item.name}
              style={{ "--i": index } as React.CSSProperties}
              onClick={() =>
                item.type === "directory"
                  ? terminal.setCurrentPath([
                      ...terminal.currentPath,
                      item.name,
                    ])
                  : terminal.executeCommand(`cat ${item.name}`)
              }
              data-active={isActive}
              className={`row-in press-row active-bar group relative flex min-h-[44px] w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left sm:min-h-0 ${
                isActive
                  ? "bg-surface-hover text-text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`}
            >
              {getFileIcon(item)}
              <span className="flex-1 truncate font-mono text-[0.8125rem]">
                {item.name}
              </span>
              {item.type === "directory" && (
                <ChevronRight
                  className="row-chevron size-3 shrink-0 text-text-tertiary"
                  strokeWidth={1.75}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
