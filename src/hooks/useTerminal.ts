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
import { isValidEmail, subscribeToNewsletter } from "../utils/newsletter"
import type { FileSystemItem } from "../context/FileSystemContext"

export const useTerminal = (fileSystem: FileSystemItem[]) => {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null)
  const [selectedFileContent, setSelectedFileContent] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Philani Mhlongo — DevOps & Cloud Engineer",
    "Type `help` for available commands.",
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
      } catch {
        // Silently fail if metadata not available
      }
    }
    loadFeaturedPosts()
  }, [])
  const [currentCommand, setCurrentCommand] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Command history for ↑/↓ recall. index === -1 means "not navigating".
  const commandHistoryRef = useRef<{ items: string[]; index: number }>({ items: [], index: -1 })

  const navigateHistory = (direction: "up" | "down") => {
    const history = commandHistoryRef.current
    if (history.items.length === 0) return

    if (direction === "up") {
      history.index = history.index === -1
        ? history.items.length - 1
        : Math.max(0, history.index - 1)
      setCurrentCommand(history.items[history.index])
    } else {
      if (history.index === -1) return
      history.index += 1
      if (history.index >= history.items.length) {
        history.index = -1
        setCurrentCommand("")
      } else {
        setCurrentCommand(history.items[history.index])
      }
    }
  }

  const handleTabAutocomplete = () => {
    const [cmd, ...args] = currentCommand.split(" ")
    const partial = args.join("")

  const matches = getCurrentDirectory()
    .map(i => i.name)
    .filter(name => name.toLowerCase().startsWith(partial.toLowerCase()))

  if (matches.length === 1) {
    setCurrentCommand(`${cmd} ${matches[0]}`)
    setAutocompleteSuggestions([])
  } else if (matches.length > 1) {
    setAutocompleteSuggestions(matches)
  }
}

  const getDirectoryAt = (path: string[]): FileSystemItem[] | null => {
    let current = fileSystem
    for (const segment of path) {
      const found = current.find(
        i => i.name.toLowerCase() === segment.toLowerCase() && i.type === "directory"
      )
      if (!found || !found.children) return null
      current = found.children
    }
    return current
  }

  const getCurrentDirectory = () => getDirectoryAt(currentPath) ?? []

  // Resolve a path argument like "welcome.md", "blog/welcome.md",
  // "../about.md" or "/blog/welcome.md" into a directory path + item name.
  const resolvePath = (arg: string): { dirPath: string[]; name: string } | null => {
    const segments = arg.split("/").filter(s => s.length > 0 && s !== ".")
    if (segments.length === 0) return null

    const name = segments.pop()!
    const dirPath = arg.startsWith("/") ? [] : [...currentPath]

    for (const segment of segments) {
      if (segment === "..") {
        dirPath.pop()
        continue
      }
      const dir = getDirectoryAt(dirPath)
      const found = dir?.find(
        i => i.type === "directory" && i.name.toLowerCase() === segment.toLowerCase()
      )
      if (!found) return null
      dirPath.push(found.name)
    }

    return { dirPath, name }
  }

  const executeCommand = async (cmd: string) => {
    const trimmed = cmd.trim()
    // Only the command word is case-insensitive; arguments (file names,
    // search queries, email addresses) keep their original casing.
    const [rawCommand, ...args] = trimmed.split(/\s+/)
    const command = (rawCommand ?? "").toLowerCase()
    let output: string[] = []

    if (trimmed) {
      const history = commandHistoryRef.current
      if (history.items[history.items.length - 1] !== trimmed) {
        history.items.push(trimmed)
      }
      history.index = -1
    }

    setSelectedFile(null)
    setSelectedFileContent("")

    const dir = getCurrentDirectory()

    switch (command) {
      case "help":
        output = [
          "",
          "NAVIGATION",
          "  ls                   list this directory",
          "  cd <dir>             change directory",
          "  cat <file>           read a file — paths work: cat blog/welcome.md",
          "  pwd                  print working directory",
          "",
          "WRITING",
          "  blog                 list every post",
          "  blog --tag <tag>     filter by tag",
          "  blog --recent <n>    n most recent",
          "  blog --featured      featured only",
          "  blog --tags          list every tag",
          "  search <query>       search posts",
          "  subscribe <email>    get notified about new posts",
          "",
          "OTHER",
          "  whoami               about me",
          "  clear                clear the screen",
          "",
          "Tab completes filenames  ·  ↑ ↓ recall history",
        ]
        break
      case "ls":
        // Directories carry a trailing slash, as a real shell does
        output = dir.map(i => (i.type === "directory" ? `${i.name}/` : i.name))
        break
      case "cd": {
        if (!args.length) {
          setCurrentPath([])
          break
        }
        const segments = args[0].split("/").filter(s => s.length > 0 && s !== ".")
        const newPath = args[0].startsWith("/") ? [] : [...currentPath]
        let failed: string | null = null

        for (const segment of segments) {
          if (segment === "..") {
            newPath.pop()
            continue
          }
          const dirItems = getDirectoryAt(newPath)
          const found = dirItems?.find(
            i => i.type === "directory" && i.name.toLowerCase() === segment.toLowerCase()
          )
          if (!found) {
            failed = segment
            break
          }
          newPath.push(found.name)
        }

        if (failed) output = [`Directory not found: ${failed}`]
        else setCurrentPath(newPath)
        break
      }
      case "cat": {
        if (!args.length) {
          output = ["Usage: cat <file>"]
          break
        }
        const resolved = resolvePath(args[0])
        const targetDir = resolved ? getDirectoryAt(resolved.dirPath) : null
        const file = targetDir?.find(
          f => f.type === "file" && f.name.toLowerCase() === resolved!.name.toLowerCase()
        )
        if (file && resolved) {
          // Keep the explorer and URL in sync when opening via a path
          if (resolved.dirPath.join("/") !== currentPath.join("/")) {
            setCurrentPath(resolved.dirPath)
          }
          setSelectedFile(file)
          const content = await getFileContent(file)
          setSelectedFileContent(content)

          // Calculate and show reading time for blog posts
          const isBlogPost = resolved.dirPath.includes("blog") && file.extension === "md"
          if (isBlogPost) {
            const readingTime = calculateReadingTime(content)
            output = [`${file.name}  ·  ${readingTime}`]
          } else {
            output = [file.name]
          }
        } else {
          output = [`File not found: ${args[0]}`]
        }
        break
      }
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
        } catch {
          // Silently fail if metadata not available
        }
        break

      case "subscribe": {
        const email = args[0]
        if (!email) {
          output = [
            "Usage: subscribe <your-email>",
            "",
            "Example:",
            "  subscribe jane@example.com",
            "",
            "You'll get an email whenever new content is published.",
          ]
          break
        }
        if (!isValidEmail(email)) {
          output = [
            `Invalid email address: ${email}`,
            "Usage: subscribe <your-email>",
          ]
          break
        }
        output = await subscribeToNewsletter(email)
        break
      }

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
            output = formatBlogListings(posts, `posts tagged ${flags.tag}`)
            break
          }

          // Show featured only
          if (flags.featured) {
            posts = getFeaturedPosts(posts)
            output = formatBlogListings(posts, 'featured posts')
            break
          }

          // Show recent N posts
          if (flags.recent && typeof flags.recent === 'string') {
            const count = parseInt(flags.recent, 10)
            if (!isNaN(count) && count > 0) {
              posts = getRecentPosts(posts, count)
              output = formatBlogListings(posts, `${count} most recent`)
              break
            }
          }

          // Default: show all posts sorted by date
          posts = sortPostsByDate(posts)
          output = formatBlogListings(posts, 'all posts')
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
    navigateHistory,
    autocompleteSuggestions
  }
}
