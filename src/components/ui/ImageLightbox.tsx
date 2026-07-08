import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn } from "lucide-react"

interface ImageLightboxProps {
  src: string
  alt: string
  className?: string
}

export const ImageLightbox = ({ src, alt, className = "" }: ImageLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    return (
      <div className="rounded-md border border-danger/50 bg-danger/10 p-4 my-4 mx-auto max-w-full">
        <div className="flex items-center gap-2 text-danger text-sm">
          <span>⚠️</span>
          <span>Failed to load image: {alt || src}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1 font-mono break-all">
          {src}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Thumbnail */}
      <div className="my-8 mx-auto group">
        <div className="relative inline-block max-w-full">
          {isLoading && (
            <div className="rounded-lg border border-border bg-surface-elevated p-12 text-center">
              <div className="text-muted-foreground text-sm animate-pulse">
                Loading image...
              </div>
            </div>
          )}
          <div
            className={`relative cursor-zoom-in overflow-hidden rounded-lg border border-border shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02] ${
              isLoading ? "opacity-0 absolute" : "opacity-100"
            }`}
            onClick={() => setIsOpen(true)}
          >
            <img
              src={src}
              alt={alt}
              className={`max-w-full h-auto ${className}`}
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true)
                setIsLoading(false)
              }}
            />
            {/* Zoom overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 text-primary-foreground rounded-full p-3">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          {!isLoading && alt && (
            <div className="text-center text-sm text-text-tertiary mt-3 italic px-4">
              {alt}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 bg-surface-elevated hover:bg-surface-hover text-foreground rounded-full p-3 transition-colors shadow-lg z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              {alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  <p className="text-white text-center font-medium">{alt}</p>
                </div>
              )}
            </motion.div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
              Click anywhere to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
