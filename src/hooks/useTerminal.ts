import { useState, useRef, useEffect } from "react"
import { getFileContent } from "../utils/fileUtils"
import {
  calculateReadingTime,
  fetchBlogMetadata,
  sortPostsByDate,
  filterPostsByTag,
  getFeaturedPosts,
  getRecentPosts,
  searchPosts,
  getAllTags
} from "../utils/blogUtils"
import {
  formatBlogListings,
  formatSearchResults,
  formatFeaturedPosts,
  formatTagsList,
  parseCommandFlags
} from "../utils/terminalFormatters"
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

  // Load featured posts on mount
  useEffect(() => {
    const loadFeaturedPosts = async () => {
      try {
        const metadata = await fetchBlogMetadata()
        const featured = getFeaturedPosts(metadata.posts)
        if (featured.length > 0) {
          setTerminalHistory(prev => [
            ...prev.slice(0, 3), // Keep welcome message
            ...formatFeaturedPosts(featured),
            ""
          ])
        }
      } catch (error) {
        // Silently fail if metadata not available
      }
    }
    loadFeaturedPosts()
  }, [])
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
        output = [
          "Available commands:",
          "",
          "Navigation:",
          "  ls              List files/directories",
          "  cd <dir>        Change directory",
          "  cat <file>      View file content",
          "  pwd             Print working directory",
          "",
          "Blog:",
          "  blog            List all blog posts",
          "  blog --tag <t>  Filter posts by tag",
          "  blog --recent N Show N recent posts",
          "  blog --featured Show featured posts",
          "  blog --tags     List all tags",
          "  search <query>  Search blog posts",
          "",
          "Other:",
          "  whoami          About me",
          "  clear           Clear terminal",
        ]
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

          // Calculate and show reading time for blog posts
          const isBlogPost = currentPath.includes("blog") && file.extension === "md"
          if (isBlogPost) {
            const readingTime = calculateReadingTime(content)
            output = [`📄 Opening ${args[0]} (${readingTime})...`]
          } else {
            output = [`Opening ${args[0]}...`]
          }
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

        // Add featured posts
        try {
          const metadata = await fetchBlogMetadata()
          const featured = getFeaturedPosts(metadata.posts)
          if (featured.length > 0) {
            output.push(...formatFeaturedPosts(featured))
          }
        } catch (error) {
          // Silently fail if metadata not available
        }
        break

      case "blog":
        try {
          const metadata = await fetchBlogMetadata()
          const { flags } = parseCommandFlags(args)

          let posts = metadata.posts

          // Handle --tags flag (list all tags)
          if (flags.tags) {
            const allTags = getAllTags(posts)
            output = formatTagsList(allTags)
            break
          }

          // Filter by tag
          if (flags.tag && typeof flags.tag === 'string') {
            posts = filterPostsByTag(posts, flags.tag)
            output = formatBlogListings(posts, `📝 Posts tagged: ${flags.tag}`)
            break
          }

          // Show featured only
          if (flags.featured) {
            posts = getFeaturedPosts(posts)
            output = formatBlogListings(posts, '⭐ Featured Posts')
            break
          }

          // Show recent N posts
          if (flags.recent && typeof flags.recent === 'string') {
            const count = parseInt(flags.recent, 10)
            if (!isNaN(count) && count > 0) {
              posts = getRecentPosts(posts, count)
              output = formatBlogListings(posts, `📰 ${count} Most Recent Posts`)
              break
            }
          }

          // Default: show all posts sorted by date
          posts = sortPostsByDate(posts)
          output = formatBlogListings(posts, '📝 All Blog Posts')
        } catch (error) {
          output = [
            'Error loading blog posts.',
            'Make sure blog metadata is properly configured.',
            '',
            `Details: ${error instanceof Error ? error.message : String(error)}`
          ]
        }
        break

      case "search":
        if (args.length === 0) {
          output = [
            'Usage: search <query>',
            '',
            'Example:',
            '  search kubernetes',
            '  search docker deployment',
            '  search devops terraform'
          ]
          break
        }

        try {
          const query = args.join(' ')
          const metadata = await fetchBlogMetadata()
          const results = searchPosts(metadata.posts, query)
          output = formatSearchResults(results, query)
        } catch (error) {
          output = [
            'Error performing search.',
            `Details: ${error instanceof Error ? error.message : String(error)}`
          ]
        }
        break

      default:
        output = [`Command not found: ${command}`, 'Type "help" for available commands']
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

