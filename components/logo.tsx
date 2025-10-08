"use client"

import Link from "next/link"

interface LogoProps {
  variant?: "header" | "footer" | "full"
  className?: string
}

export function Logo({ variant = "header", className = "" }: LogoProps) {
  const baseClasses = "font-serif tracking-widest transition-all duration-300"
  
  if (variant === "full") {
    return (
      <Link href="/" className={`flex flex-col items-center justify-center ${className}`}>
        <div className="text-center">
          <h1 className={`${baseClasses} text-4xl md:text-6xl font-light mb-2`}>
            LUXXE
          </h1>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className={`${baseClasses} text-lg md:text-xl font-normal tracking-[0.3em]`}>
              LABELS
            </span>
          </div>
          <div className="w-16 h-[1px] bg-current mx-auto mb-3" />
          <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-muted-foreground">
            High Fashion, Higher Standards
          </p>
        </div>
      </Link>
    )
  }

  if (variant === "footer") {
    return (
      <Link href="/" className={`flex flex-col items-center ${className}`}>
        <div className="text-center">
          <h2 className={`${baseClasses} text-2xl font-light mb-1`}>
            LUXXE
          </h2>
          <div className="flex items-center justify-center">
            <span className={`${baseClasses} text-sm font-normal tracking-[0.2em]`}>
              LABELS
            </span>
          </div>
          <div className="w-8 h-[1px] bg-current mx-auto my-2" />
          <p className="text-xs font-medium tracking-[0.1em] text-muted-foreground">
            High Fashion, Higher Standards
          </p>
        </div>
      </Link>
    )
  }

  // Header variant (default)
  return (
    <Link href="/" className={`flex flex-col items-center hover:scale-105 transition-transform duration-300 ${className}`}>
      <div className="text-center">
        <h1 className={`${baseClasses} text-xl font-light leading-none`}>
          LUXXE
        </h1>
        <div className="flex items-center justify-center">
          <span className={`${baseClasses} text-xs font-normal tracking-[0.2em] leading-none`}>
            LABELS
          </span>
        </div>
        <div className="w-6 h-[0.5px] bg-current mx-auto mt-1" />
      </div>
    </Link>
  )
}