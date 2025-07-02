import { useState, useRef, useEffect } from "react"
import { getFileContent } from "../utils/fileUtils"
import type { FileSystemItem } from "../context/FileSystemContext"

export const useTerminal = (fileSystem: FileSystemItem[]) => {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null)
  const [selectedFileContent, setSelectedFileContent] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Welcome to Philani's DevOps Workspace",
    'Type "help" for available commands',
    "",
  ])
  const [currentCommand, setCurrentCommand] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleTabAutocomplete = () => {
    const [cmd, ...args] = currentCommand.split(" ")
    const partial = args.join("")

  const matches = getCurrentDirectory()
    .map(i => i.name)
    .filter(name => name.startsWith(partial))

  if (matches.length === 1) {
    setCurrentCommand(`${cmd} ${matches[0]}`)
    setAutocompleteSuggestions([])
  } else if (matches.length > 1) {
    setAutocompleteSuggestions(matches)
  }
}

 
  const getCurrentDirectory = () => {
    let current = fileSystem
    for (const segment of currentPath) {
      const found = current.find(i => i.name === segment && i.type === "directory")
      if (!found || !found.children) return []
      current = found.children
    }
    return current
  }

  const executeCommand = async (cmd: string) => {
    const lowerCmd = cmd.trim().toLowerCase()
    const [command, ...args] = lowerCmd.split(" ")
    let output: string[] = []

    setSelectedFile(null)
    setSelectedFileContent("")

    const dir = getCurrentDirectory()

    switch (command) {
      case "help":
        output = ["Available commands:", "ls", "cd <dir>", "cat <file>", "pwd", "clear", "whoami"]
        break
      case "ls":
        output = dir.map(i => `${i.type === "directory" ? "📁" : "📄"} ${i.name}`)
        break
      case "cd":
        if (!args.length) setCurrentPath([])
        else if (args[0] === "..") setCurrentPath(prev => prev.slice(0, -1))
        else {
          const target = dir.find(d => d.name === args[0] && d.type === "directory")
          if (target) setCurrentPath(prev => [...prev, args[0]])
          else output = [`Directory not found: ${args[0]}`]
        }
        break
      case "cat":
        const file = dir.find(f => f.name === args[0] && f.type === "file")
        if (file) {
          setSelectedFile(file)
          const content = await getFileContent(file)
          setSelectedFileContent(content)
          output = [`Opening ${args[0]}...`]
        } else {
          output = [`File not found: ${args[0]}`]
        }
        break
      case "pwd":
        output = [`/${currentPath.join("/")}`]
        break
      case "clear":
        setTerminalHistory([])
        return
      case "whoami":
        output = ["Philani Mhlongo", "DevOps Engineer", "South Africa"]
        break
      default:
        output = [`Command not found: ${command}`]
    }

    setTerminalHistory(prev => [...prev, `$ ${cmd}`, ...output, ""])
  }

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight
  }, [terminalHistory])

  return {
    currentPath,
    selectedFile,
    selectedFileContent,
    terminalHistory,
    currentCommand,
    setCurrentCommand,
    setCurrentPath,
    executeCommand,
    terminalRef,
    inputRef,
    getCurrentDirectory,
    setSelectedFile,
    setSelectedFileContent,
    handleTabAutocomplete, 
    autocompleteSuggestions
    
  }
}

