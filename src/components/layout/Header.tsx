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
    textClass: "text-accent",
    dotClass: "bg-accent",
  },

  running: {
    label: "Running",
    textClass: "text-primary",
    dotClass: "bg-primary animate-pulse",
  },

  failed: {
    label: "Failed",
    textClass: "text-destructive",
    dotClass: "bg-destructive",
  },
}

const DEPLOY_CONFIG: Record<
  DeployStatus,
  StatusConfig
> = {
  active: {
    label: "Active",
    textClass: "text-accent",
    dotClass: "bg-accent",
  },

  deploying: {
    label: "Deploying",
    textClass: "text-primary",
    dotClass: "bg-primary animate-pulse",
  },

  degraded: {
    label: "Degraded",
    textClass: "text-destructive",
    dotClass: "bg-destructive",
  },
}

/* ──────────────────────────────────────────────────────────
   Helpers
────────────────────────────────────────────────────────── */

function formatUptime(
  seconds: number,
): string {
  const d = Math.floor(seconds / 86400)

  const h = Math.floor(
    (seconds % 86400) / 3600,
  )

  const m = Math.floor(
    (seconds % 3600) / 60,
  )

  return `${d}d ${String(h).padStart(
    2,
    "0",
  )}h ${String(m).padStart(2, "0")}m`
}

function utcNow(): string {
  return (
    new Date()
      .toISOString()
      .replace("T", " ")
      .slice(0, 19) + " UTC"
  )
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

export const Header = () => {
  const getSAST = () => {
    return new Date().toLocaleTimeString("en-ZA", {
      hour12: false,
      timeZone: "Africa/Johannesburg",
    })
  }

  const [utcTime, setUtcTime] = useState(getSAST())
  const [uptime, setUptime] = useState(19821600)

  useEffect(() => {
    const id = setInterval(() => {
      setUtcTime(getSAST())
      setUptime((prev) => prev + 1)
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
          {/* Uptime */}

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
              Uptime
            </span>

            <span
              className="
                font-mono
                text-sm
                text-foreground
                tabular-nums
              "
            >
              {formatUptime(uptime)}
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

        <motion.div
  initial={{
    opacity: 0,
    y: 8,
    scale: 0.96,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
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
    border-border/70

    bg-card/80
    backdrop-blur-md

    overflow-hidden
  "
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
    className="
      relative
      z-10
      size-5
      text-primary
    "
  />
</motion.div>

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