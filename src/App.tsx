import { fileSystem } from "./context/FileSystemContext"
import { useTerminal } from "./hooks/useTerminal"
import { Header } from "./components/layout/Header"
import { FileExplorer } from "./components/layout/FileExplorer"
import { TerminalPanel } from "./components/layout/TerminalPanel"
import { Card } from "./components/ui/Card"
import { Badge } from "./components/ui/Badge"
import { getFileIcon } from "./components/file/FileIcon"
import { Maximize2, Minimize2, X } from "lucide-react"
import { lazy, Suspense, useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import './styles/App.css'

// Loaded lazily so the markdown/KaTeX/syntax-highlighting stack and the
// particles animation stay out of the initial bundle.
const FileRenderer = lazy(() =>
  import("./components/file/FileRenderer").then(m => ({ default: m.FileRenderer }))
)
const UniverseBackground = lazy(() => import("./components/ui/UniverseBackground"))

function App() {
  const terminal = useTerminal(fileSystem)
  const location = useLocation()
  const navigate = useNavigate()
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isViewerFullscreen, setIsViewerFullscreen] = useState(false)
  // Tracks URLs we set ourselves so the URL→command effect doesn't re-run
  // commands the user just typed.
  const syncedPathRef = useRef<string | null>(null)

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
    for (let i = 0; i < segments.length - 1; i++) {
      const dir = currentDir.find(f => f.name === segments[i] && f.type === 'directory')
      if (!dir?.children) return
      currentDir = dir.children
    }

    const lastSegment = segments[segments.length - 1]
    const file = currentDir.find(f =>
      f.type === 'file' && (
        f.name === lastSegment ||
        f.name.replace(/\.[^/.]+$/, '') === lastSegment
      )
    )

    // A single path-aware command avoids chaining cd+cat, which read stale
    // state when executed back-to-back in the same render.
    if (file) {
      terminal.executeCommand(`cat /${[...segments.slice(0, -1), file.name].join('/')}`)
    } else if (currentDir.find(f => f.name === lastSegment && f.type === 'directory')) {
      terminal.executeCommand(`cd /${segments.join('/')}`)
    }
  }, [location.pathname])

  // Update URL when terminal navigation changes
  useEffect(() => {
    if (terminal.selectedFile) {
      // Build URL from current path + selected file
      const pathSegments = [...terminal.currentPath]
      const fileName = terminal.selectedFile.name.replace(/\.[^/.]+$/, '') // Remove extension
      pathSegments.push(fileName)

      const newPath = '/' + pathSegments.join('/')
      if (location.pathname !== newPath) {
        syncedPathRef.current = newPath
        navigate(newPath, { replace: true })
      }
    } else if (terminal.currentPath.length > 0) {
      // Just in a directory, no file selected
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

  return (
     <div className="relative min-h-screen text-foreground font-sans">
       <Suspense fallback={null}>
         <UniverseBackground />
       </Suspense>
    <div className="relative z-10">
      <Header
        isTerminalOpen={isTerminalOpen}
        onTerminalToggle={() => setIsTerminalOpen(!isTerminalOpen)}
      />

      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* File Explorer */}
          <FileExplorer terminal={terminal} />

          {/* File Viewer + Terminal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected file viewer */}
            {terminal.selectedFile && (
              <>
                {isViewerFullscreen && (
                  <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsViewerFullscreen(false)}
                    aria-hidden
                  />
                )}
                <Card
                  className={
                    isViewerFullscreen
                      ? "fixed inset-2 md:inset-6 z-50 flex flex-col bg-card border border-border rounded-md overflow-hidden shadow-panel"
                      : "bg-card border border-border backdrop rounded-md overflow-hidden shadow-panel"
                  }
                >
                  <div className="px-4 py-3 border-b border-border bg-surface-elevated flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(terminal.selectedFile)}
                      <span className="font-medium text-sm text-foreground truncate">{terminal.selectedFile.name}</span>
                      <Badge variant="secondary" className="text-[11px] font-mono rounded-sm">
                        {terminal.selectedFile.extension}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label={isViewerFullscreen ? "Exit full screen" : "View full screen"}
                        title={isViewerFullscreen ? "Exit full screen (Esc)" : "View full screen"}
                        onClick={() => setIsViewerFullscreen(v => !v)}
                      >
                        {isViewerFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                      </button>
                      <button
                        className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                        aria-label="Close file"
                        onClick={closeFile}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div
                    className={
                      isViewerFullscreen
                        ? "flex-1 overflow-y-auto px-5 py-6 md:px-8"
                        : "px-5 py-4 max-h-[420px] overflow-y-auto"
                    }
                  >
                    <div className={isViewerFullscreen ? "max-w-3xl mx-auto" : undefined}>
                      <Suspense fallback={<div className="text-sm text-muted-foreground font-mono">Loading…</div>}>
                        <FileRenderer
                          content={terminal.selectedFileContent}
                          extension={terminal.selectedFile.extension}
                          fileName={terminal.selectedFile.name}
                        />
                      </Suspense>
                    </div>
                  </div>
                </Card>
              </>
            )}


            {/* Terminal */}
            <TerminalPanel
              terminal={terminal}
              isOpen={isTerminalOpen}
              onClose={() => setIsTerminalOpen(false)}
            />
          </div>
        </div>
      </main>
    </div>
    </div>
  )
}

export default App
