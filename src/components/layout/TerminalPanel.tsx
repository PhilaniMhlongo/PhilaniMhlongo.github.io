import { Minus, Maximize2, Minimize2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
    className="press flex size-[44px] items-center justify-center rounded-sm text-text-tertiary hover:bg-surface-hover hover:text-text-primary sm:size-6"
  >
    {children}
  </button>
)

export const TerminalPanel = ({ terminal, isOpen = true, onClose }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  // Only lines added since the last render animate in; re-rendering must
  // never replay the whole scrollback.
  const renderedCount = useRef(0)
  const animateFrom = Math.min(renderedCount.current, terminal.terminalHistory.length)
  useEffect(() => {
    renderedCount.current = terminal.terminalHistory.length
  }, [terminal.terminalHistory])

  if (!isOpen) return null

  return (
    <section
      className={`flex flex-col overflow-hidden rounded border border-border bg-surface ${
        isMaximized ? "fixed inset-4 z-50" : ""
      }`}
      aria-label="Terminal"
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
        <span className="md-label font-bold">terminal</span>
        <span className="text-2xs text-text-tertiary">
          ~/{terminal.currentPath.join("/")}
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
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          tabIndex={0}
        >
          {terminal.terminalHistory.map((line, i) => {
            // Line type carries the colour, the way a README would:
            // `$` echoes, `##` section labels, `//` commentary.
            let tone = "text-text-secondary"
            if (line.startsWith("$")) tone = "text-accent"
            else if (line.startsWith("##")) tone = "text-accent font-bold"
            else if (line.trimStart().startsWith("//")) tone = "text-text-tertiary italic"

            const isNew = i >= animateFrom
            return (
              <div
                key={i}
                className={`whitespace-pre-wrap ${tone} ${isNew ? "line-in" : ""}`}
                style={isNew ? ({ "--i": i - animateFrom } as React.CSSProperties) : undefined}
              >
                {line || " "}
              </div>
            )
          })}

          <div className="mt-1 flex items-center gap-2">
            {/* Keyed on history length so the flick replays per command. */}
            <span
              key={terminal.terminalHistory.length}
              className="prompt-ack select-none text-accent"
              aria-hidden
            >
              ❯
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
              className="min-h-[44px] flex-1 bg-transparent text-text-primary caret-accent outline-none placeholder:text-text-tertiary sm:min-h-0"
              placeholder="type a command — try `help`"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal command input"
              spellCheck={false}
              autoComplete="off"
            />
          </div>

          {terminal.autocompleteSuggestions.length > 1 && (
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 pl-4 text-text-tertiary">
              {terminal.autocompleteSuggestions.map((s, i) => (
                <span
                  key={s}
                  className="suggest-in"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
