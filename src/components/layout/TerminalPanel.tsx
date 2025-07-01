import { Minimize2, Maximize2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"
import { useTerminal } from "../../hooks/useTerminal"

type ReturnTypeOfUseTerminal = ReturnType<typeof useTerminal>

interface Props {
  terminal: ReturnTypeOfUseTerminal
}

export const TerminalPanel = ({ terminal }: Props) => (
  <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm">
    <div className="p-3 border-b border-slate-700 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
        <span className="text-sm font-medium ml-2">Terminal</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="h-6 w-6"><Minimize2 className="w-3 h-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Maximize2 className="w-3 h-3" /></Button>
      </div>
    </div>
    <div
      ref={terminal.terminalRef}
      className="p-4 h-80 overflow-y-auto font-mono text-sm bg-slate-950/50"
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
    <div className="absolute inset-0 pointer-events-none">
      {terminal.autocompleteSuggestions.length > 1 && (
  <div className="text-xs text-slate-400 mt-1 ml-6">
    {terminal.autocompleteSuggestions.join("  ")}
  </div>
      )}
    </div>
  </Card>
)
