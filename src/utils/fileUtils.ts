import type { FileSystemItem } from "../context/FileSystemContext"

export const getFileContent = async (file: FileSystemItem): Promise<string> => {
  try {
    const res = await fetch(file.contentPath!)
    if (!res.ok) throw new Error(`Failed to fetch ${file.name}`)
    return file.extension === "json" ? JSON.stringify(await res.json(), null, 2) : await res.text()
  } catch (err) {
    return `Error: ${(err as Error).message}`
  }
}
