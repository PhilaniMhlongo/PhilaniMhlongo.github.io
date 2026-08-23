import { fileSystem } from "./context/FileSystemContext"
import { useTerminal } from "./hooks/useTerminal"
import { Header } from "./components/layout/Header"
import { FileExplorer } from "./components/layout/FileExplorer"
import { TerminalPanel } from "./components/layout/TerminalPanel"
import { getFileIcon } from "./components/file/FileIcon"
import { Maximize2, Minimize2, X } from "lucide-react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// Loaded lazily so the markdown/KaTeX/syntax-highlighting stack stays out of
// the initial bundle.
const FileRenderer = lazy(() =>
  import("./components/file/FileRenderer").then(m => ({ default: m.FileRenderer }))
)

function App() {
  const terminal = useTerminal(fileSystem)
  const location = useLocation()
  const navigate = useNavigate()
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isViewerFullscreen, setIsViewerFullscreen] = useState(false)
  // Tracks URLs we set ourselves so the URL→command effect doesn't re-run
  // commands the user just typed.
  const syncedPathRef = useRef<string | null>(null)
  // StrictMode double-invokes effects in development; report each dead link once.
  const reportedMissingRef = useRef<string | null>(null)

  // Parse URL and execute the corresponding terminal command
  useEffect(() => {
    if (location.pathname === syncedPathRef.current) return

    const segments = location.pathname.split('/').filter(Boolean)

    if (segments.length === 0) {
      terminal.executeCommand("cat about.md")
      return
    }

    // Walk the filesystem to the parent directory of the last segment
    let currentDir = fileSystem
    let walked = true
    for (let i = 0; i < segments.length - 1; i++) {
      const dir = currentDir.find(f => f.name === segments[i] && f.type === 'directory')
      if (!dir?.children) { walked = false; break }
      currentDir = dir.children
    }

    const lastSegment = segments[segments.length - 1]
    const file = walked
      ? currentDir.find(f =>
          f.type === 'file' && (
            f.name === lastSegment ||
            f.name.replace(/\.[^/.]+$/, '') === lastSegment
          )
        )
      : undefined

    // A single path-aware command avoids chaining cd+cat, which read stale
    // state when executed back-to-back in the same render.
    if (file) {
      terminal.executeCommand(`cat /${[...segments.slice(0, -1), file.name].join('/')}`)
    } else if (walked && currentDir.find(f => f.name === lastSegment && f.type === 'directory')) {
      terminal.executeCommand(`cd /${segments.join('/')}`)
    } else {
      // A deep link that no longer resolves should say so rather than
      // silently rendering the home page.
      if (reportedMissingRef.current !== location.pathname) {
        reportedMissingRef.current = location.pathname
        terminal.reportMissingPath(location.pathname)
      }
      syncedPathRef.current = '/'
      navigate('/', { replace: true })
    }
  }, [location.pathname])

  // Update URL when terminal navigation changes
  useEffect(() => {
    if (terminal.selectedFile) {
      const pathSegments = [...terminal.currentPath]
      const fileName = terminal.selectedFile.name.replace(/\.[^/.]+$/, '')
      pathSegments.push(fileName)

      const newPath = '/' + pathSegments.join('/')
      if (location.pathname !== newPath) {
        syncedPathRef.current = newPath
        navigate(newPath, { replace: true })
      }
    } else if (terminal.currentPath.length > 0) {
      const newPath = '/' + terminal.currentPath.join('/')
      if (location.pathname !== newPath) {
        syncedPathRef.current = newPath
        navigate(newPath, { replace: true })
      }
    }
  }, [terminal.selectedFile, terminal.currentPath])

  // Blog posts open in full screen for distraction-free reading
  useEffect(() => {
    const isBlogPost =
      terminal.selectedFile?.extension === "md" &&
      terminal.currentPath.includes("blog")
    setIsViewerFullscreen(Boolean(isBlogPost))
  }, [terminal.selectedFile, terminal.currentPath])

  // Escape exits full screen
  useEffect(() => {
    if (!isViewerFullscreen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsViewerFullscreen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isViewerFullscreen])

  const closeFile = () => {
    setIsViewerFullscreen(false)
    terminal.setSelectedFile(null)
    terminal.setSelectedFileContent("")
    syncedPathRef.current = '/'
    navigate('/', { replace: true })
  }

  // "/" focuses the terminal from anywhere — 17 tab stops is too far to
  // reach the site's primary interaction.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = document.activeElement
      const typing = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      if (e.key === "/" && !typing) {
        e.preventDefault()
        setIsTerminalOpen(true)
        requestAnimationFrame(() => terminal.inputRef.current?.focus())
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [terminal.inputRef])

  // 44px is the touch minimum; the compact size is a pointer-only affordance.
  const viewerButton =
    "press flex size-[44px] items-center justify-center rounded-sm text-text-tertiary hover:bg-surface-hover hover:text-text-primary sm:size-7"

  return (
    <div className="min-h-screen">
      <a
        href="#terminal"
        onClick={(e) => {
          e.preventDefault()
          setIsTerminalOpen(true)
          requestAnimationFrame(() => terminal.inputRef.current?.focus())
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-accent focus:bg-surface focus:px-3 focus:py-2 focus:text-2xs focus:text-text-primary"
      >
        skip to terminal
      </a>
      <Header
        isTerminalOpen={isTerminalOpen}
        onTerminalToggle={() => setIsTerminalOpen(!isTerminalOpen)}
        openFile={terminal.selectedFile?.name}
      />

      <main className="mx-auto max-w-[1400px] px-6 py-6">
        {/* Mobile scrolls naturally; the viewport-locked split is a
            large-screen affordance. */}
        <div className="grid grid-cols-1 gap-5 lg:h-[calc(100vh-9.5rem)] lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* No mobile height cap: at 44px touch rows a fixed cap clipped the
              last row in half, which reads as broken rather than scrollable. */}
          <div>
            <FileExplorer terminal={terminal} />
          </div>

          <div className="flex min-h-0 flex-col gap-5">
            {terminal.selectedFile && (
              <>
                {isViewerFullscreen && (
                  <div
                    className="backdrop-in fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
                    onClick={() => setIsViewerFullscreen(false)}
                    aria-hidden
                  />
                )}
                <article
                  key={terminal.selectedFile.name}
                  className={
                    isViewerFullscreen
                      ? "sheet-in fixed inset-3 z-50 flex flex-col overflow-hidden rounded border border-border bg-surface md:inset-8"
                      : "panel-in relative flex min-h-0 flex-col overflow-hidden rounded border border-border bg-surface"
                  }
                >
                  {/* One sweep as the file lands. Keyed with the article, so
                      it replays per file and never loops. */}
                  <span className="scanline z-10" aria-hidden />

                  <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-3 py-2">
                    {getFileIcon(terminal.selectedFile)}
                    <span className="truncate text-2xs text-text-secondary">
                      {terminal.selectedFile.name}
                    </span>

                    <div className="ml-auto flex items-center gap-0.5">
                      <button
                        className={viewerButton}
                        aria-label={isViewerFullscreen ? "Exit full screen" : "View full screen"}
                        title={isViewerFullscreen ? "Exit full screen (Esc)" : "View full screen"}
                        onClick={() => setIsViewerFullscreen(v => !v)}
                      >
                        {isViewerFullscreen ? (
                          <Minimize2 className="size-3.5" strokeWidth={1.75} />
                        ) : (
                          <Maximize2 className="size-3.5" strokeWidth={1.75} />
                        )}
                      </button>
                      <button
                        className={viewerButton}
                        aria-label="Close file"
                        title="Close file"
                        onClick={closeFile}
                      >
                        <X className="size-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      isViewerFullscreen
                        ? "flex-1 overflow-y-auto px-6 py-10 md:px-10"
                        : "max-h-[26rem] overflow-y-auto px-6 py-6"
                    }
                  >
                    <div className={isViewerFullscreen ? "mx-auto max-w-[68ch]" : undefined}>
                      <Suspense
                        fallback={
                          <div className="font-mono text-2xs text-text-tertiary">
                            loading…
                          </div>
                        }
                      >
                        <FileRenderer
                          content={terminal.selectedFileContent}
                          extension={terminal.selectedFile.extension}
                          fileName={terminal.selectedFile.name}
                        />
                      </Suspense>
                    </div>
                  </div>
                </article>
              </>
            )}

            <TerminalPanel
              terminal={terminal}
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
