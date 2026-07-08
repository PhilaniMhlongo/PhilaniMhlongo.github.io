import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Terminal,
  Github,
  Linkedin,
  Mail,
  GitBranch,
  CheckCircle2,
  Rocket,
  Clock3,
  Activity,
  Server,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */

type CIStatus = "passing" | "running" | "failed"

type DeployStatus =
  | "active"
  | "deploying"
  | "degraded"

interface StatusConfig {
  label: string
  textClass: string
  dotClass: string
}

/* ──────────────────────────────────────────────────────────
   Status Config
────────────────────────────────────────────────────────── */

const CI_CONFIG: Record<
  CIStatus,
  StatusConfig
> = {
  passing: {
    label: "Passing",
    textClass: "text-success",
    dotClass: "bg-success",
  },

  running: {
    label: "Running",
    textClass: "text-warning",
    dotClass: "bg-warning animate-pulse",
  },

  failed: {
    label: "Failed",
    textClass: "text-danger",
    dotClass: "bg-danger",
  },
}

const DEPLOY_CONFIG: Record<
  DeployStatus,
  StatusConfig
> = {
  active: {
    label: "Active",
    textClass: "text-success",
    dotClass: "bg-success",
  },

  deploying: {
    label: "Deploying",
    textClass: "text-info",
    dotClass: "bg-info animate-pulse",
  },

  degraded: {
    label: "Degraded",
    textClass: "text-warning",
    dotClass: "bg-warning",
  },
}

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */

const CAREER_START = new Date("2025-10-01")
function getExperience(): string {
  const now = new Date()
  const months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + now.getMonth() - CAREER_START.getMonth()
  const yrs = Math.floor(months / 12)
  const mo  = months % 12
  if (yrs === 0) return `${mo}mo xp`
  if (mo  === 0) return `${yrs}yr xp`
  return `${yrs}yr ${mo}mo xp`
}


/* ──────────────────────────────────────────────────────────
   Small Components
────────────────────────────────────────────────────────── */

const Dot = ({
  className,
}: {
  className: string
}) => (
  <span
    className={`
      size-1.5
      rounded-full
      flex-shrink-0
      ${className}
    `}
  />
)

const Pipe = () => (
  <span
    className="
      text-border
      text-sm
      select-none
    "
    aria-hidden
  >
    |
  </span>
)

const StatusPill = ({
  icon: Icon,
  label,
  config,
}: {
  icon: React.ElementType
  label: string
  config: StatusConfig
}) => (
  <div
    className="
      flex
      items-center
      gap-1.5
      flex-shrink-0
    "
  >
    <Dot className={config.dotClass} />

    <Icon
      className="
        size-3
        text-muted-foreground
      "
      aria-hidden
    />

    <span
      className="
        text-[11px]
        uppercase
        tracking-wide
        text-muted-foreground
      "
    >
      {label}
    </span>

    <span
      className={`
        font-mono
        text-sm
        font-medium
        ${config.textClass}
      `}
    >
      {config.label}
    </span>
  </div>
)

/* ──────────────────────────────────────────────────────────
   Header
────────────────────────────────────────────────────────── */

interface HeaderProps {
  isTerminalOpen: boolean
  onTerminalToggle: () => void
}

export const Header = ({ isTerminalOpen, onTerminalToggle }: HeaderProps) => {
  const getSAST = () => {
    return new Date().toLocaleTimeString("en-ZA", {
      hour12: false,
      timeZone: "Africa/Johannesburg",
    })
  }

  const [utcTime, setUtcTime] = useState(getSAST())
  const [experience, setExperience] = useState(getExperience)

  useEffect(() => {
    const id = setInterval(() => {
      setUtcTime(getSAST())
      setExperience(getExperience())
    }, 1000)

    return () => clearInterval(id)
  }, [])

  /* Mock operational state */
  const ciStatus: CIStatus = "passing"

  const deployStatus: DeployStatus =
    "active"

  const branch = "main"

  const env = "prod"

  return (
    <header
      className="
        sticky
        top-0
        z-50

        border-b
        border-border

        bg-background/95
        backdrop-blur-sm
      "
    >
      {/* ─────────────────────────────
          Row 1 — Ops Status Bar
      ───────────────────────────── */}

      <div
        className="
          flex
          items-center
          gap-4

          overflow-x-auto

          border-b
          border-border

          px-4
          py-2
        "
      >
        <StatusPill
          icon={CheckCircle2}
          label="Build"
          config={CI_CONFIG[ciStatus]}
        />

        <Pipe />

        <StatusPill
          icon={Rocket}
          label="Deploy"
          config={
            DEPLOY_CONFIG[deployStatus]
          }
        />

        <Pipe />

        {/* Branch */}

        <div
          className="
            flex
            items-center
            gap-1.5
            flex-shrink-0
          "
        >
          <GitBranch
            className="
              size-3
              text-muted-foreground
            "
          />

          <span
            className="
              text-[11px]
              uppercase
              tracking-wide
              text-muted-foreground
            "
          >
            Branch
          </span>

          <span
            className="
              font-mono
              text-sm
              text-primary
            "
          >
            {branch}
          </span>
        </div>

        <Pipe />

        {/* Environment */}

        <div
          className="
            flex
            items-center
            gap-1.5
            flex-shrink-0
          "
        >
          <Activity
            className="
              size-3
              text-muted-foreground
            "
          />

          <span
            className="
              text-[11px]
              uppercase
              tracking-wide
              text-muted-foreground
            "
          >
            Env
          </span>

          <span
            className="
              rounded-sm
              border
              border-border

              bg-card

              px-2
              py-0.5

              font-mono
              text-[11px]
              text-accent
            "
          >
            {env}
          </span>
        </div>

        {/* Right side */}

        <div
          className="
            ml-auto
            flex
            items-center
            gap-4
            flex-shrink-0
          "
        >
          {/* Experience */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <Server
              className="
                size-3
                text-muted-foreground
              "
            />

            <span
              className="
                text-[11px]
                uppercase
                tracking-wide
                text-muted-foreground
              "
            >
              Experience
            </span>

            <span
              className="
                font-mono
                text-sm
                text-foreground
                tabular-nums
              "
            >
              {experience}
            </span>
          </div>

          <Pipe />

          {/* Clock */}

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <Clock3
              className="
                size-3
                text-muted-foreground
              "
            />

            <span
              className="
                font-mono
                text-sm
                text-muted-foreground
                tabular-nums
              "
            >
              {utcTime}
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────
          Row 2 — Identity
      ───────────────────────────── */}

      <div
        className="
          flex
          items-center
          justify-between

          px-4
          py-4
        "
      >
        {/* Left */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          {/* Terminal Icon */}

        <motion.button
  onClick={onTerminalToggle}
  initial={{
    opacity: 0,
    y: 8,
    scale: 0.96,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
    borderColor: isTerminalOpen ? "hsl(var(--primary))" : "hsl(var(--border)/0.7)",
    boxShadow: isTerminalOpen
      ? `0 0 0 1px rgba(47,129,247,0.25), 0 4px 12px rgba(47,129,247,0.12)`
      : "none",
  }}
  whileHover={{
    scale: 1.06,
    y: -2,
    rotateX: 4,
    rotateY: -4,

    borderColor: "hsl(var(--primary))",

    boxShadow: `
      0 0 0 1px rgba(47,129,247,0.25),
      0 8px 30px rgba(47,129,247,0.18),
      0 0 40px rgba(47,129,247,0.12)
    `,
  }}
  whileTap={{
    scale: 0.94,
    y: 1,
  }}
  transition={{
    type: "spring",
    stiffness: 340,
    damping: 18,
    mass: 0.8,
  }}
  style={{
    transformStyle: "preserve-3d",
  }}
  className="
    relative
    flex
    items-center
    justify-center

    size-10

    rounded-xl

    border

    bg-card/80
    backdrop-blur-md

    overflow-hidden
    cursor-pointer
  "
  title={isTerminalOpen ? "Close Terminal" : "Open Terminal"}
>
  {/* Glow Layer */}
  <motion.div
    className="
      absolute
      inset-0
      opacity-0
      bg-primary/10
      blur-xl
    "
    whileHover={{
      opacity: 1,
    }}
    transition={{
      duration: 0.2,
    }}
  />

  {/* Icon */}
  <Terminal
    className={`
      relative
      z-10
      size-5
      transition-colors
      ${isTerminalOpen ? 'text-primary' : 'text-muted-foreground'}
    `}
  />
</motion.button>

          {/* Identity */}

          <div className="leading-tight">
            <h1
              className="
                text-lg
                font-semibold
                tracking-tight
                text-foreground
              "
            >
              Philani Mhlongo
            </h1>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  font-mono
                  text-sm
                  text-muted-foreground
                "
              >
                DevOps Engineer
              </span>

              <span
                className="
                  text-border
                  text-xs
                  select-none
                "
              >
                •
              </span>

              <span
                className="
                  font-mono
                  text-sm
                  text-muted-foreground
                "
              >
                ZA
              </span>
            </div>
          </div>
        </div>

        {/* Right */}

        <nav
          className="
            flex
            items-center
            gap-1
          "
          aria-label="Social links"
        >
          <a
            href="https://github.com/PhilaniMhlongo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="
              flex
              items-center
              justify-center

              size-8

              rounded-md

              border
              border-transparent

              text-muted-foreground

              hover:border-border
              hover:bg-card
              hover:text-foreground
            "
          >
            <Github className="size-4" />
          </a>

          <a
            href="https://linkedin.com/in/philani-mhlongo-720382131/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="
              flex
              items-center
              justify-center

              size-8

              rounded-md

              border
              border-transparent

              text-muted-foreground

              hover:border-border
              hover:bg-card
              hover:text-foreground
            "
          >
            <Linkedin className="size-4" />
          </a>

          <a
            href="mailto:mhlongophilani04@gmail.com"
            aria-label="Email"
            className="
              flex
              items-center
              justify-center

              size-8

              rounded-md

              border
              border-transparent

              text-muted-foreground

              hover:border-border
              hover:bg-card
              hover:text-foreground
            "
          >
            <Mail className="size-4" />
          </a>
        </nav>
      </div>
    </header>
  )
}
