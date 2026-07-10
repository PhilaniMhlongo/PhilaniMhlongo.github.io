import { fileSystem } from "./context/FileSystemContext"
import { useTerminal } from "./hooks/useTerminal"
import { Header } from "./components/layout/Header"
import { FileExplorer } from "./components/layout/FileExplorer"
import { TerminalPanel } from "./components/layout/TerminalPanel"
import { FileRenderer } from "./components/file/FileRenderer"
import { Card } from "./components/ui/Card"
import { Badge } from "./components/ui/Badge"
import { getFileIcon } from "./components/file/FileIcon"
import UniverseBackground from "./components/ui/UniverseBackground"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import './styles/App.css'

function App() {
  const terminal = useTerminal(fileSystem)
  const location = useLocation()
  const navigate = useNavigate()
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)

  // Parse URL and execute corresponding terminal commands
  useEffect(() => {
    const path = location.pathname.replace(/^\//, '') // Remove leading slash

    if (!path || path === '/') {
      // Homepage - show about
      terminal.executeCommand("cat about.md")
      return
    }

    // Parse path like /blog/welcome or /projects/terminal-portfolio/readme.md
    const segments = path.split('/').filter(Boolean)

    if (segments.length === 0) {
      terminal.executeCommand("cat about.md")
      return
    }

    // Build terminal commands to navigate to the file
    const commands: string[] = []

    // Navigate to directory if needed
    if (segments.length > 1) {
      // cd to the directory (e.g., 'blog', 'projects/terminal-portfolio')
      for (let i = 0; i < segments.length - 1; i++) {
        commands.push(`cd ${segments[i]}`)
      }
    } else {
      // Single segment - could be a directory or file in root
      const item = fileSystem.find(f => f.name === segments[0] || f.name === `${segments[0]}.md`)
      if (item?.type === 'directory') {
        commands.push(`cd ${segments[0]}`)
      }
    }

    // Get the last segment (could be file name without extension)
    const lastSegment = segments[segments.length - 1]

    // Try to find a matching file
    let currentDir = fileSystem
    for (let i = 0; i < segments.length - 1; i++) {
      const dir = currentDir.find(f => f.name === segments[i] && f.type === 'directory')
      if (dir?.children) {
        currentDir = dir.children
      }
    }

    // Look for the file (with or without extension)
    const file = currentDir.find(f =>
      f.type === 'file' && (
        f.name === lastSegment ||
        f.name === `${lastSegment}.md` ||
        f.name.replace(/\.[^/.]+$/, '') === lastSegment
      )
    )

    if (file) {
      commands.push(`cat ${file.name}`)
    }

    // Execute commands sequentially
    commands.forEach(cmd => terminal.executeCommand(cmd))
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
        navigate(newPath, { replace: true })
      }
    } else if (terminal.currentPath.length > 0) {
      // Just in a directory, no file selected
      const newPath = '/' + terminal.currentPath.join('/')
      if (location.pathname !== newPath) {
        navigate(newPath, { replace: true })
      }
    } else if (location.pathname !== '/' && !terminal.selectedFile) {
      // Back at root with no file
      // Don't navigate to avoid loops
    }
  }, [terminal.selectedFile, terminal.currentPath])

  return (
     <div className="relative min-h-screen text-foreground font-sans">
       <UniverseBackground />
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
              <Card className="bg-card border border-border backdrop rounded-md overflow-hidden shadow-panel">
                <div className="px-4 py-3 border-b border-border bg-surface-elevated flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(terminal.selectedFile)}
                    <span className="font-medium text-sm text-foreground truncate">{terminal.selectedFile.name}</span>
                    <Badge variant="secondary" className="text-[11px] font-mono rounded-sm">
                      {terminal.selectedFile.extension}
                    </Badge>
                  </div>
                  <button
                    className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground "
                    onClick={() => {
                      terminal.setSelectedFile(null)
                      terminal.setSelectedFileContent("")
                      navigate('/', { replace: true })
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="px-5 py-4 max-h-[420px] overflow-y-auto">
                  <FileRenderer
                    content={terminal.selectedFileContent}
                    extension={terminal.selectedFile.extension}
                    fileName={terminal.selectedFile.name}
                  />
                </div>
              </Card>
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
