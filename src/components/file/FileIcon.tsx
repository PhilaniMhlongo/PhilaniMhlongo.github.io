import {
  Folder,
  File,
  Code,
  Database,
  Settings,
} from "lucide-react"

import type { FileSystemItem } from "../../context/FileSystemContext"

export const getFileIcon = (file: FileSystemItem) => {
  const baseClass =
    "w-4 h-4 flex-shrink-0"

  if (file.type === "directory") {
    return (
      <Folder
        className={`${baseClass} text-primary`}
      />
    )
  }

  switch (file.extension) {
    case "py":
      return (
        <Code
          className={`${baseClass} text-primary`}
        />
      )

    case "json":
      return (
        <Database
          className={`${baseClass} text-accent`}
        />
      )

    case "md":
      return (
        <File
          className={`${baseClass} text-slate-300`}
        />
      )

    case "tf":
    case "yaml":
    case "yml":
      return (
        <Settings
          className={`${baseClass} text-foreground`}
        />
      )

    default:
      return (
        <File
          className={`${baseClass} text-muted-foreground`}
        />
      )
  }
}