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
import { useEffect } from "react"
import './styles/App.css'

function App() {
  const terminal = useTerminal(fileSystem)
  
  useEffect(() => {
      terminal.executeCommand("cat about.md")
    }, [])

  return (
     <div className="relative min-h-screen text-foreground font-sans">
       <UniverseBackground />
    <div className="relative z-10"></div>
      <Header />

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
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="px-5 py-4 max-h-[420px] overflow-y-auto">
                  <FileRenderer
                    content={terminal.selectedFileContent}
                    extension={terminal.selectedFile.extension}
                  />
                </div>
              </Card>
            )}


            {/* Terminal */}
            <TerminalPanel terminal={terminal} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
