
import { useEffect, useState } from "react"

interface Props {
  text: string
  speed?: number // milliseconds between characters
  className?: string
}

export const TypewriterLine = ({ text, speed = 15, className }: Props) => {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i])
      i++
      if (i >= text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return <div className={className}>{displayedText}</div>
}
