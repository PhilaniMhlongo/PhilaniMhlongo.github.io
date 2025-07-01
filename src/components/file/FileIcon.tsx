import { Folder, File, Code, Database, Settings } from "lucide-react"
import type { FileSystemItem } from "../../context/FileSystemContext"

export const getFileIcon = (file: FileSystemItem) => {
  if (file.type === "directory") return <Folder className="w-4 h-4 text-purple-400" />
  switch (file.extension) {
    case "py": return <Code className="w-4 h-4 text-blue-400" />
    case "json": return <Database className="w-4 h-4 text-yellow-400" />
    case "md": return <File className="w-4 h-4 text-green-400" />
    case "tf": case "yaml": case "yml": return <Settings className="w-4 h-4 text-red-400" />
    default: return <File className="w-4 h-4" />
  }
}

