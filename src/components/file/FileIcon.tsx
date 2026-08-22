import { Folder, FileText, FileCode, FileJson, FileCog } from "lucide-react"

import type { FileSystemItem } from "../../context/FileSystemContext"

/**
 * Icons are shape-coded, not colour-coded: the file type reads from the
 * glyph while colour stays reserved for state (selection, hover).
 */
export const getFileIcon = (file: FileSystemItem) => {
  const cls = "size-3.5 shrink-0 text-text-tertiary"
  const stroke = 1.75

  if (file.type === "directory") {
    return <Folder className={cls} strokeWidth={stroke} />
  }

  switch (file.extension) {
    case "py":
    case "ts":
    case "tsx":
    case "js":
      return <FileCode className={cls} strokeWidth={stroke} />
    case "json":
      return <FileJson className={cls} strokeWidth={stroke} />
    case "tf":
    case "yaml":
    case "yml":
      return <FileCog className={cls} strokeWidth={stroke} />
    default:
      return <FileText className={cls} strokeWidth={stroke} />
  }
}
