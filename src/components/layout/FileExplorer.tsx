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
        <span className="font-mono text-2xs uppercase tracking-label text-text-tertiary">
          files
        </span>
        <span className="ml-auto truncate font-mono text-2xs text-text-tertiary">
          ~/{terminal.currentPath.join("/")}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {!atRoot && (
          <button
            onClick={() =>
              terminal.setCurrentPath(terminal.currentPath.slice(0, -1))
            }
            className="mb-0.5 flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-text-tertiary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
          >
            <ChevronLeft className="size-3.5 shrink-0" strokeWidth={1.75} />
            <span className="font-mono text-[0.8125rem]">..</span>
          </button>
        )}

        {items.map((item) => {
          const isActive = terminal.selectedFile?.name === item.name
          return (
            <button
              key={item.name}
              onClick={() =>
                item.type === "directory"
                  ? terminal.setCurrentPath([
                      ...terminal.currentPath,
                      item.name,
                    ])
                  : terminal.executeCommand(`cat ${item.name}`)
              }
              className={`group flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors duration-150 ${
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
                  className="size-3 shrink-0 text-text-tertiary"
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
