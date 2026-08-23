import { useState, useEffect } from "react"
import { Terminal, Github, Linkedin, Mail } from "lucide-react"

const CAREER_START = new Date("2025-10-01")

function getExperience(): string {
  const now = new Date()
  const months =
    (now.getFullYear() - CAREER_START.getFullYear()) * 12 +
    now.getMonth() - CAREER_START.getMonth()
  const yrs = Math.floor(months / 12)
  const mo = months % 12
  if (yrs === 0) return `${mo}mo`
  if (mo === 0) return `${yrs}yr`
  return `${yrs}yr ${mo}mo`
}

function getLocalTime(): string {
  return new Date().toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Johannesburg",
  })
}

const SOCIAL = [
  { href: "https://github.com/PhilaniMhlongo", label: "GitHub", Icon: Github },
  {
    href: "https://linkedin.com/in/philani-mhlongo-720382131/",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  { href: "mailto:mhlongophilani04@gmail.com", label: "Email", Icon: Mail },
]

interface HeaderProps {
  isTerminalOpen: boolean
  onTerminalToggle: () => void
  /** Current file, shown the way an editor titles an open buffer. */
  openFile?: string
}

export const Header = ({ isTerminalOpen, onTerminalToggle, openFile }: HeaderProps) => {
  const [time, setTime] = useState(getLocalTime)

  useEffect(() => {
    // Minute precision — a ticking seconds counter is motion without meaning.
    const id = setInterval(() => setTime(getLocalTime()), 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-4">
        <div className="min-w-0">
          {/* Deliberately not an <h1>: the open document owns that, and two
              competing h1s make the outline meaningless. */}
          <p className="truncate text-[0.9375rem] font-bold tracking-tight text-text-primary">
            ~/philani
            {openFile && (
              <span className="font-normal text-text-tertiary"> — {openFile}</span>
            )}
          </p>
          <p className="mt-0.5 truncate text-2xs text-text-tertiary">
            platform &amp; devops engineer
            <span className="mx-1.5 text-border-strong">·</span>
            durban, za
            <span className="mx-1.5 text-border-strong">·</span>
            {getExperience()} experience
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <span className="mr-3 hidden text-2xs tabular-nums text-text-tertiary sm:inline">
            {time} SAST
          </span>

          {SOCIAL.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className="lift flex size-[44px] items-center justify-center rounded text-text-tertiary hover:bg-surface-hover hover:text-text-primary sm:size-8"
            >
              <Icon className="size-[15px]" strokeWidth={1.75} />
            </a>
          ))}

          <span className="mx-1.5 h-4 w-px bg-border" aria-hidden />

          <button
            onClick={onTerminalToggle}
            aria-pressed={isTerminalOpen}
            title={isTerminalOpen ? "Hide terminal" : "Show terminal"}
            className={`lift flex size-[44px] items-center justify-center rounded sm:size-8 ${
              isTerminalOpen
                ? "bg-surface-hover text-accent"
                : "text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
            }`}
          >
            <Terminal className="size-[15px]" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  )
}
