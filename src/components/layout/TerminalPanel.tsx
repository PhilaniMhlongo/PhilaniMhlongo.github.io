import { Minimize2, Maximize2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { useTerminal } from "../../hooks/useTerminal"
import { useState } from "react"

type ReturnTypeOfUseTerminal = ReturnType<typeof useTerminal>

interface Props {
  terminal: ReturnTypeOfUseTerminal
  isOpen?: boolean
  onClose?: () => void
}

export const TerminalPanel = ({ terminal, isOpen = true, onClose }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  if (!isOpen) {
    return null
  }

  return (
  <Card className={`bg-slate-900/80 border-slate-700 backdrop-blur-sm ${isMaximized ? 'fixed inset-4 z-50' : ''}`}>
    <div className="p-3 border-b border-slate-700 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <button
            onClick={() => {
              if (onClose) onClose()
            }}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors flex items-center justify-center group"
            title="Close"
          >
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => {
              setIsMinimized(!isMinimized)
              setIsMaximized(false)
            }}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors flex items-center justify-center group"
            title="Minimize"
          >
            <Minimize2 className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => {
              setIsMaximized(!isMaximized)
              setIsMinimized(false)
            }}
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors flex items-center justify-center group"
            title="Maximize"
          >
            <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
        <span className="text-sm font-medium ml-2">Terminal</span>
      </div>
      {isMaximized && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsMaximized(false)}
        >
          <Minimize2 className="w-3 h-3" />
        </Button>
      )}
    </div>
    <AnimatePresence>
      {!isMinimized && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
    <div
      ref={terminal.terminalRef}
      className={`p-4 overflow-y-auto font-mono text-sm bg-slate-950/50 ${
        isMaximized ? 'h-[calc(100vh-8rem)]' : 'h-80'
      }`}
      onClick={() => terminal.inputRef.current?.focus()}
    >
      {terminal.terminalHistory.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.01 }}
          className={line.startsWith("$") ? "text-green-400" : "text-slate-300"}
        >
          {line}
        </motion.div>
      ))}
      <div className="flex items-center mt-2">
        <span className="text-green-400 mr-2">$</span>
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
  }
}}

          className="flex-1 bg-transparent outline-none text-white"
          placeholder="Type a command..."
          spellCheck={false}
        />
        <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-2 h-4 bg-white ml-1" />
      </div>
      
    </div>
    </motion.div>
      )}
    </AnimatePresence>
    <div className="absolute inset-0 pointer-events-none">
      {terminal.autocompleteSuggestions.length > 1 && (
  <div className="text-xs text-slate-400 mt-1 ml-6">
    {terminal.autocompleteSuggestions.join("  ")}
  </div>
      )}
    </div>
  </Card>
  )
}
