import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  className?: string
}

export const ImageLightbox = ({ src, alt, className = "" }: ImageLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  if (hasError) {
    return (
      <span className="my-6 block border-l-2 border-danger pl-4 font-mono text-2xs text-text-tertiary">
        Image unavailable — {src}
      </span>
    )
  }

  return (
    <>
      <figure className="my-8">
        <button
          onClick={() => setIsOpen(true)}
          className="block w-full cursor-zoom-in overflow-hidden rounded border border-border"
          aria-label={alt ? `View larger: ${alt}` : "View larger image"}
        >
          <img
            src={src}
            alt={alt}
            className={`h-auto w-full ${className}`}
            loading="lazy"
            onError={() => setHasError(true)}
          />
        </button>
        {alt && (
          <figcaption className="mt-3 font-mono text-2xs text-text-tertiary">
            {alt}
          </figcaption>
        )}
      </figure>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt || "Image viewer"}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-5 top-5 flex size-8 items-center justify-center rounded text-text-tertiary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary"
            aria-label="Close image viewer"
          >
            <X className="size-4" strokeWidth={1.75} />
          </button>

          <figure
            className="max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="mx-auto h-auto max-h-[85vh] w-auto max-w-full rounded border border-border"
            />
            {alt && (
              <figcaption className="mt-4 text-center font-mono text-2xs text-text-tertiary">
                {alt}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  )
}
