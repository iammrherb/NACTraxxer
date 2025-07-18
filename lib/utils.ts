import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "complete":
    case "completed":
      return "text-green-600 bg-green-100"
    case "in progress":
    case "in-progress":
      return "text-blue-600 bg-blue-100"
    case "planned":
      return "text-gray-600 bg-gray-100"
    case "delayed":
      return "text-red-600 bg-red-100"
    case "failed":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "text-red-600 bg-red-100"
    case "medium":
      return "text-yellow-600 bg-yellow-100"
    case "low":
      return "text-green-600 bg-green-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
