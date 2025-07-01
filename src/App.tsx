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

import './styles/App.css'

function App() {
  const terminal = useTerminal(fileSystem)

  return (
     <div className="relative min-h-screen text-white font-sans">
       <UniverseBackground />
    <div className="relative z-10"></div>
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* File Explorer */}
          <FileExplorer terminal={terminal} />

          {/* File Viewer + Terminal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected file viewer */}
            {terminal.selectedFile && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(terminal.selectedFile)}
                    <span className="font-medium">{terminal.selectedFile.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {terminal.selectedFile.extension}
                    </Badge>
                  </div>
                  <button
                    className="text-slate-300 hover:text-red-400 text-sm"
                    onClick={() => {
                      terminal.setSelectedFile(null)
                      terminal.setSelectedFileContent("")
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
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
