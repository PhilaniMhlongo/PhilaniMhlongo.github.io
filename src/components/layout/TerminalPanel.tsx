import { Minus, Maximize2, Minimize2, X } from "lucide-react"
import { useState } from "react"
import { useTerminal } from "../../hooks/useTerminal"

type ReturnTypeOfUseTerminal = ReturnType<typeof useTerminal>

interface Props {
  terminal: ReturnTypeOfUseTerminal
  isOpen?: boolean
  onClose?: () => void
}

const ChromeButton = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="flex size-6 items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
  >
    {children}
  </button>
)

export const TerminalPanel = ({ terminal, isOpen = true, onClose }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  if (!isOpen) return null

  return (
    <section
      className={`flex flex-col overflow-hidden rounded border border-border bg-surface ${
        isMaximized ? "fixed inset-4 z-50" : ""
      }`}
      aria-label="Terminal"
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
        <span className="font-mono text-2xs uppercase tracking-label text-text-tertiary">
          terminal
        </span>
        <span className="font-mono text-2xs text-text-tertiary">
          — ~/{terminal.currentPath.join("/")}
        </span>

        <div className="ml-auto flex items-center gap-0.5">
          <ChromeButton
            label={isMinimized ? "Expand terminal" : "Collapse terminal"}
            onClick={() => {
              setIsMinimized(!isMinimized)
              setIsMaximized(false)
            }}
          >
            <Minus className="size-3.5" strokeWidth={1.75} />
          </ChromeButton>
          <ChromeButton
            label={isMaximized ? "Restore terminal" : "Maximize terminal"}
            onClick={() => {
              setIsMaximized(!isMaximized)
              setIsMinimized(false)
            }}
          >
            {isMaximized ? (
              <Minimize2 className="size-3.5" strokeWidth={1.75} />
            ) : (
              <Maximize2 className="size-3.5" strokeWidth={1.75} />
            )}
          </ChromeButton>
          <ChromeButton label="Close terminal" onClick={() => onClose?.()}>
            <X className="size-3.5" strokeWidth={1.75} />
          </ChromeButton>
        </div>
      </div>

      {!isMinimized && (
        <div
          ref={terminal.terminalRef}
          className={`overflow-y-auto p-4 font-mono text-[0.8125rem] leading-relaxed ${
            isMaximized ? "flex-1" : "h-72"
          }`}
          onClick={() => terminal.inputRef.current?.focus()}
        >
          {terminal.terminalHistory.map((line, i) => {
            const isCommand = line.startsWith("$")
            return (
              <div
                key={i}
                className={`whitespace-pre-wrap ${
                  isCommand ? "text-accent" : "text-text-secondary"
                }`}
              >
                {line || " "}
              </div>
            )
          })}

          <div className="mt-1 flex items-center gap-2">
            <span className="select-none text-accent" aria-hidden>
              $
            </span>
            <input
              ref={terminal.inputRef}
              type="text"
              value={terminal.currentCommand}
              onChange={(e) => terminal.setCurrentCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  terminal.executeCommand(terminal.currentCommand)
                  terminal.setCurrentCommand("")
                } else if (e.key === "Tab") {
                  e.preventDefault()
                  terminal.handleTabAutocomplete()
                } else if (e.key === "ArrowUp") {
                  e.preventDefault()
                  terminal.navigateHistory("up")
                } else if (e.key === "ArrowDown") {
                  e.preventDefault()
                  terminal.navigateHistory("down")
                }
              }}
              className="flex-1 bg-transparent text-text-primary caret-accent outline-none placeholder:text-text-tertiary"
              placeholder="type a command — try `help`"
              aria-label="Terminal command input"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {terminal.autocompleteSuggestions.length > 1 && (
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 pl-4 text-text-tertiary">
              {terminal.autocompleteSuggestions.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
