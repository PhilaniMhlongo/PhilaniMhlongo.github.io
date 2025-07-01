import { Folder, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Card } from "../ui/Card"
import { getFileIcon } from "../file/FileIcon"
import { useTerminal } from "../../hooks/useTerminal"

type ReturnTypeOfUseTerminal = ReturnType<typeof useTerminal>

interface Props {
  terminal: ReturnTypeOfUseTerminal
}
export const FileExplorer = ({ terminal }: Props) => {
  const items = terminal.getCurrentDirectory()

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="h-full bg-slate-800/50 border-slate-700 backdrop-blur-sm flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-medium flex items-center space-x-2">
            <Folder className="w-4 h-4 text-purple-400" />
            <span>File Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">/{terminal.currentPath.join("/")}</p>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors group"
                onClick={() =>
                  item.type === "directory"
                    ? terminal.setCurrentPath([...terminal.currentPath, item.name])
                    : terminal.executeCommand(`cat ${item.name}`)
                }
              >
                {getFileIcon(item)}
                <span className="flex-1 text-sm group-hover:text-purple-300 transition-colors">
                  {item.name}
                </span>
                {item.type === "directory" && (
                  <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-purple-400" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {terminal.currentPath.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors mt-2 border-t border-slate-700"
              onClick={() => terminal.setCurrentPath(terminal.currentPath.slice(0, -1))}
            >
              <ChevronRight className="w-3 h-3 rotate-180 text-slate-500" />
              <span className="text-sm text-slate-400">.. (parent)</span>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
