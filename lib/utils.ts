import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // In production (GitHub Pages), prepend the base path
  if (process.env.NODE_ENV === 'production') {
    return `/luxelabel/${cleanPath}`
  }
  
  // In development, use the path as is
  return `/${cleanPath}`
}
